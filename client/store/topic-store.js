import {
  observable,
  toJS,
  computed,
  action,
  extendObservable,
} from 'mobx';

import { topicSchema, replySchema } from '../views/util/variable-define';
import { get, post } from '../views/util/http';

const createTopic = topic => Object.assign({}, topicSchema, topic);

const createReply = reply => Object.assign({}, replySchema, reply);

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }

  @observable syncing = false
  @observable createdReplies = []

  @action doReply(content) {
    return new Promise((resolve, reject) => {
      post(`/topic/${this.id}/replies`, {
        needAccessToken: true,
      }, { content })
        .then((res) => {
          if (res.success) {
            this.createdReplies.push(createReply({
              id: res.reply_id,
              content,
              create_at: Date.now(),
            }));
            resolve();
          } else {
            reject(res);
          }
        })
        .catch(reject);
    });
  }
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable syncing
  @observable createdTopics = []
  @observable tab

  constructor({
    syncing = false, topics = [], tab = null, details = [],
  } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(topic => new Topic(createTopic(topic)));
    this.tab = tab;
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail;
      return result;
    }, {});
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.topics.length > 0) {
        resolve();
      } else {
        this.tab = tab;
        this.syncing = true;
        this.topics = [];
        get('topics', { tab, mdrender: false })
          .then((res) => {
            if (res.success) {
              this.topics = res.data.map(topic => new Topic(createTopic(topic)));
              resolve();
            } else {
              reject(res);
            }
            this.syncing = false;
          })
          .catch((err) => {
            reject(err.response.data);
            this.syncing = false;
          });
      }
    });
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id]);
      } else {
        get(`/topic/${id}`, { mdrender: false })
          .then((res) => {
            if (res.success) {
              const topic = new Topic(createTopic(res.data));
              this.details.push(topic);
              resolve(topic);
            } else {
              reject(res);
            }
          })
          .catch(reject);
      }
    });
  }

  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('/topics', {
        needAccessToken: true,
      }, {
        title, tab, content,
      }).then((res) => {
        if (res.success) {
          const topic = {
            title,
            tab,
            content,
            id: res.topic_id,
            create_at: Date.now(),
          };
          this.createdTopics.push(new Topic(createTopic(topic)));
          resolve();
        } else {
          reject(res);
        }
      }).catch(reject);
    });
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: toJS(this.syncing),
      details: toJS(this.details),
      tab: this.tab,
    };
  }
}
