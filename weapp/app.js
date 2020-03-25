const { request } = require('./utils/util.js');

App({
  onLaunch: function() {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || [];
    //logs.unshift(Date.now());
    //wx.setStorageSync('logs', logs);
    this.globalData.sid = wx.getStorageSync('sid');
    const that = this;

    // wx login state check
    wx.checkSession({
      success() {
        if (!that.globalData.sid) {
          console.log("sid no found! exec login() next!");
          that.login();
        } else {
          //session_key 未过期，并且在本生命周期一直有效
          console.log("session_key is valid!");
          // server login state check
          request('/check-session').then(r => {
            //console.log("check-session: ", r.data);
            if (r.data.code) {
                console.log("check-session success!");
              } else {
                console.log("check-session fail!");
                that.login();
              }
            })
          .catch(err => console.log(err));
        }
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        that.login();
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("getSetting(): ", res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          });
        }
      }
    });
  },

  login() {
    const that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        request('/login', { code: res.code }).then(res => {
          console.log("login return: ", res.data);
          that.globalData.sid = res.data.sid;
          wx.setStorageSync('sid', res.data.sid);
        }).catch(err => console.log(err));

        // wx.request({
        //   url: `${this.globalData.host}/login?code=${res.code}`,
        //   success: res => {
        //     console.log("login return: ", res.data);
        //     that.globalData.sid = res.data.sid;
        //     wx.setStorageSync('sid', res.data.sid);
        //   }
        // })
      }
    });
  },

  globalData: {
    sid: null,
    userInfo: {},
    host: 'https://www.all2key.cn/yz/auction',
    socketTask: null,
    apptoken: 'yz_auction'
  }
});