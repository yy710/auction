const { request } = require('../../utils/util.js');

Page({

  /**
   * Page initial data
   */
  data: {
    steps: [],
    active: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("options: ", options);
    const { carid } = options;
    request('/get-history', { carid })
    .then(res => {
      console.log("get-history: ", res.data);
      const steps = res.data.content;
      this.setData({ steps, active: steps.length - 1 });
    })
    .catch(err => console.log(err));
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})