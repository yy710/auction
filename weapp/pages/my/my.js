const { request } = require('../../utils/util');

Page({
  data: {
    hasUserInfo: true,
    userInfo: null,
    cars: []
  },

  onShow: function (options) {
    this.hasGottenUserInfo();
    this.getMycar();
  },

  getMycar() {
    request('/get-mycar', {}).then(res => {
      console.log("get-mycar: ", res.data);
      const cars = res.data.content;
      this.setData({ cars });
    }).catch(err => console.log(err));
  },

  hasGottenUserInfo: function () {
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({ success: data => this.setData({ hasUserInfo: true, userInfo: data.userInfo }) });
        } else {
          this.setData({ hasUserInfo: false });
        }
      }
    });
  },

  onGetUserInfo: function (event) {
    let userInfo = event.detail.userInfo;
    if (userInfo) {
      this.setData({ hasUserInfo: true, userInfo: userInfo });
    }
  },

  onShareAppMessage() {

  }
})