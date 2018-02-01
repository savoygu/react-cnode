import { observable, action } from 'mobx';

import { get, post } from '../views/util/http';

let notifyId = 0;
export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      syncing: false,
      recent_topics: [],
      recent_replies: [],
    },
    collections: {
      syncing: false,
      list: [],
    },
  }
  @observable activeNotifications = []
  @observable notifications = []

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('user/login', {}, {
        accessToken,
      }).then((res) => {
        if (res.success) {
          this.user.info = res.data;
          this.user.isLogin = true;
          resolve();
        } else {
          reject(res);
        }
      }).catch(reject);
    });
  }

  @action notify(config) {
    config.id = notifyId;
    notifyId += 1;
    this.activeNotifications.push(config);
  }

  @action closeNotify(notify) {
    this.activeNotifications.splice(this.activeNotifications.indexOf(notify), 1);
    this.notifications.push(notify);
  }

  @action getUserDetail() {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`user/${this.user.info.loginname}`)
        .then((res) => {
          if (res.success) {
            this.user.detail.recent_topics = res.data.recent_topics;
            this.user.detail.recent_replies = res.data.recent_replies;
            resolve();
          } else {
            reject(res);
          }
          this.user.detail.syncing = false;
        }).catch((err) => {
          this.user.detail.syncing = false;
          reject(err.response.data);
        });
    });
  }

  @action getUserCollection() {
    this.user.collections.syncing = true;
    return new Promise((resolve, reject) => {
      get(`topic_collect/${this.user.info.loginname}`)
        .then((res) => {
          if (res.success) {
            this.user.collections.list = res.data;
            resolve();
          } else {
            reject(res);
          }
          this.user.collections.syncing = false;
        }).catch((err) => {
          this.user.collections.syncing = false;
          reject(err.response.data);
        });
    });
  }
}
