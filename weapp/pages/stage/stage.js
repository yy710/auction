const { request } = require('../../utils/util.js');

Page({
  data: {
    auctions: []
  },

  toHistory(e){
    //console.log('toHistory: ', e.currentTarget.id);
    const carid = e.currentTarget.id;
    wx.navigateTo({ url: '/pages/history/history?carid=' + carid });
  },

  onLoad: function (options) {
   
  },

  onReady: function () {

  },

  onShow: function () {
    request('/get-auctions', {}).then(res => {
      console.log("get-auctions: ", res.data);

      const auctions = res.data.content;
      this.setData({ auctions });
    }).catch(err => console.log(err));
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})