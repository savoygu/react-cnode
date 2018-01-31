import { observable, action } from 'mobx';

import { get, post } from '../views/util/http';

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

  // constructor({ user = { isLogin: false, info: {} } } = {}) {
  //   this.user.isLogin = user.isLogin;
  //   this.user.info = user.info;
  // }

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
          reject(res.data);
        }
      }).catch(reject);
    });
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
            reject(res.data);
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
            reject(res.data);
          }
          this.user.collections.syncing = false;
        }).catch((err) => {
          this.user.collections.syncing = false;
          reject(err.response.data);
        });
    });
  }
}
