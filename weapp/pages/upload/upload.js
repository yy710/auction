const { inQyweixin } = require('../../utils/util.js');
const app = getApp();
const host = app.globalData.host;

Page({
  data: {
     //{ url: 'http://iph.href.lu/60x60?text=default', name: '图片2', isImage: true }
    fileList: []
  },

  driverSuccess: function(e){
    console.log("driver info: ", e);
  },

  afterRead: function(event) {
    const that = this;
    const { file } = event.detail;
    console.log(file);
    //fileList.push({ ...file, url: file.path });
    //return 0;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: host + '/upload-photos',
      filePath: file.path,
      name: 'photos',
      formData: { user: 'test' },
      success(res) {
        console.log(res.data);
        const data = JSON.parse(res.data);
        const { fileList } = that.data;//获取原文件列表
        fileList.push({ url: data.url, filename: data.filename });
        // 上传完成需要更新 fileList
        that.setData({ fileList });
      }
    });
  },

  deletePhoto(event){
    const that = this;
    const index = event.detail.index;
    console.log(index);
  
    // delete photo from server
    wx.request({
      url: host + '/delete-photo',
      data: { filename: that.data.fileList[index].filename },
      success: function(res){
        console.log(res.data);
        // delete photo from client
        const fileList = that.data.fileList;
        fileList.splice(index, 1);
        that.setData({ fileList });
      }
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log("inQyweixin: ", inQyweixin());
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