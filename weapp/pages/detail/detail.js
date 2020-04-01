const app = getApp();
const { request } = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    socketText: '当前价格未到保留价',
    reachReserve: false,
    detail: {},
    isAdmin: false,
    carid: null
  },

  onChangePrice(e){
    console.log("newPrice: ", e.detail);
    this.setData({ "detail.startPrice": e.detail.price/10000, "reachReserve": e.detail.reachReserve });
  },

  onChangeCar(e){
    console.log("onChangeCar", e.detail);
    wx.reLaunch({ url: 'detail?carid=' + e.detail.carid });
  },

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({ userInfo: e.detail.userInfo, hasUserInfo: true });
  },

  onLoad: function(options) {
    console.log("onLoad options: ", options);
    const carid = options.carid;
    // init auction of component
    this.setData({ carid });
    return 1;

    //  wx office write ---------------------------------
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo, hasUserInfo: true });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({ userInfo: res.userInfo, hasUserInfo: true });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({ userInfo: res.userInfo, hasUserInfo: true });
        }
      })
    }

    // admin -------------------------------------------
    var nickName = app.globalData.userInfo.nickName || '';
    if (nickName === '学游泳的鱼') {
      //this.setData({ isAdmin: true });
    } 
  },

  onShow(){
    console.log("page detail onShow!");
    getStage(this, this.data.carid);
  },

  onHide(){
    console.log("page detail onHide!");
    this.setData({ carid: null });
  },

  onShareAppMessage: function() {

  },

  dispatchBind() {
    var carid = this.data.carid;
    wx.switchTab({ url: '/pages/report/report?carid=' + carid });
  },

  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.detail.imageURLs;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },

  goFenqi() {
    var carid = this.data.carid;
    wx.switchTab({
      url: '/pages/fenqi/fenqi?carid=' + carid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },

  handleDelete() {
    const carid = this.data.carid;
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function(res) {
        if (res.confirm) {
          deleteCar(this, carid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  handleUnable() {
    const carid = this.data.carid;
    wx.showModal({ 
      title: '提示',
      content: '是否确认下架？',
      success: function(res) {
        if (res.confirm) {
          unableCar(this, carid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
});

// -----------------------------------------------------
function getStage(page, carid) {
  if(!carid)return 0;
  wx.showLoading({ title: '正在加载' });

  request('/get-stage', { carid }).then(res => {
    // res.data : { code: 0, msg: "ok", car: {} }
    console.log("get-stage: ", res.data);
    const code = res.data.code;
    wx.hideLoading();
    if (code === 0) {
      const detail = res.data.content;
      page.setData({ detail });
    } else {
      wx.showModal({ title: '提示', content: res.data.msg, showCancel: false });
    }
  }).catch(err => {
    console.log(err);
    wx.hideLoading();
    wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  });
}

function deleteCar(page, carid) {
  var appInstance = getApp();
  var host = appInstance.globalData.host;
  wx.request({
    url: host + '/deleteCar',
    method: "POST",
    data: { carid: carid },
    header: { "Content-Type": "application/json" },
    success: function(res) {
      var code = res.data.code
      if (code === 0) {
        wx.showToast({ title: '删除成功', icon: 'success', duration: 2000 })
      } else {
        wx.showModal({ title: '提示', content: res.data.msg, showCancel: false })
      }
    },
    fail: function(e) {
      console.log(e);
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false })
    }
  });
}

function unableCar(page, carid) {
  var appInstance = getApp();
  var host = appInstance.globalData.host;
  wx.request({
    url: host + '/unableCar',
    method: "POST",
    data: { carid: carid },
    header: { "Content-Type": "application/json" },
    success: function(res) {
      var code = res.data.code;
      if (code === 0) {
        wx.showToast({ title: '下架成功', icon: 'success', duration: 2000 });
      } else {
        wx.showModal({ title: '提示', content: res.data.msg, showCancel: false });
      }
    },
    fail: function(e) {
      console.log(e);
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false })
    }
  });
}