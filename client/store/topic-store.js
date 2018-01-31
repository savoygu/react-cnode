import {
  observable,
  // toJS,
  computed,
  action,
  extendObservable,
} from 'mobx';

import { topicSchema } from '../views/util/variable-define';
import { get } from '../views/util/http';

const createTopic = topic => Object.assign({}, topicSchema, topic);

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }

  @observable syncing = false
}

export default class TopicStore {
  @observable topics
  @observable details
  @observable syncing

  constructor({ syncing = false, topics = [], details = [] } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(topic => new Topic(createTopic(topic)));
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
      this.syncing = true;
      this.topics = [];
      get('topics', { tab, mdrender: false })
        .then((res) => {
          if (res.success) {
            res.data.forEach((item) => {
              this.addTopic(item);
            });
            resolve();
          } else {
            reject();
          }
          this.syncing = false;
        })
        .catch((err) => {
          reject(err);
          this.syncing = false;
        });
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
              reject();
            }
          })
          .catch(reject);
      }
    });
  }
}
