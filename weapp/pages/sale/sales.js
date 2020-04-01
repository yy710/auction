const { request } = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    cars: []
  },

  onLoad: function (options) {
    //getList(this);
  },

  onShow: function(){
    getList(this);
  },
  
  goToDetail: function (e) {
    console.log(e);
    const { userInfo } = e.detail;
    // if getUserInfo error
    if(!userInfo){
      wx.showToast({
        title: '请同意授权用户信息！',
        duration: 2000
      });
      return 0;
    }

    app.globalData.userInfo = userInfo;

    // update userinfo to db of server
    request('/update-userinfo', { userInfo }).then(res => {
      var carid = e.currentTarget.id
      const url = '../detail/detail?carid=' + carid;
      //wx.navigateTo({ url });
      //wx.switchTab({ url });
      wx.reLaunch({ url });
    }).catch(err => console.log(err));
  }
});

//--------------------------------------------------------------
function getList(page) {
  wx.showLoading({ title: '正在获取' });
  request('/get-cars', {}).then(res => {
    wx.hideLoading();
    console.log("get-cars: ", res.data);
    const cars = res.data.cars;
    page.setData({ cars });
  }).catch(err => {
      wx.hideLoading();
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  });
}