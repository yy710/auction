Page({

  /**
   * Page initial data
   */
  data: {
    fileList: []
  },

  afterRead: function(event) {
    const that = this;
    const { file } = event.detail;
    console.log(file);
    const { fileList } = this.data;
    fileList.push({ ...file, url: file.path });
    this.setData({ fileList });
    //return 0;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.all2key.cn/yz/upload-photos',
      filePath: file.path,
      name: 'photos',
      formData: { user: 'test' },
      success(res) {
        console.log(res.data);
        // 上传完成需要更新 fileList
        const { fileList } = that.data;
        fileList.push({ ...file, url: res.data.url });
        that.setData({ fileList });
      }
    });
  },

  deletePhoto(event){
    const index = event.detail.index;
    console.log(index);
    const fileList = this.data.fileList;
    fileList.splice(index,1);
    this.setData({fileList});
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {

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