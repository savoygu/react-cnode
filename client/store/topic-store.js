import {
  observable,
  // toJS,
  // computed,
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
  @observable syncing

  constructor({ syncing, topics } = { syncing: false, topics: [] }) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
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
}
