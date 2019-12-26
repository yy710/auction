const app = getApp();
let socketTask = null;

Page({

  /**
   * Page initial data
   */
  data: {
    socketText: '等待连接。。。',
    socketMsg: ''
  },

  add() {
    socketTask.send({
      data: JSON.stringify({
        price: 1000
      }),
      success: function() {
        console.log("socket send data ok!");
      }
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    socketTask = wx.connectSocket({
      url: 'wss://www.all2key.cn',
      header: {
        'content-type': 'appliction/json',
        'client': 100
      }
    });

    socketTask.onOpen(res => {
      console.log(res);
      this.setData({
        socketText: '连接成功！'
      });
    });

    socketTask.onMessage(res => {
      //console.log("recive: ", res);
      const data = JSON.parse(res.data);
      data.price && this.setData({
        socketText: data.price,
      });
      data.msg && this.setData({ socketMsg: data.msg})
    });

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})