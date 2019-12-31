Page({

  /**
   * Page initial data
   */
  data: {
     //{url: 'http://iph.href.lu/60x60?text=default', name: '图片2', isImage: true}
    fileList: [
      { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' },
      { url: 'https://www.all2key.cn/yz/auction/images/OqPsm7Cs1577775621300.jpg'},
      { url: 'https://www.all2key.cn/yz/auction/images/Gwk7o13u1577776248587.jpeg'}
      ]
  },

  afterRead: function(event) {
    const that = this;
    const { file } = event.detail;
    console.log(file);
    //fileList.push({ ...file, url: file.path });
    //return 0;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.all2key.cn/yz/auction/upload-photos',
      filePath: file.path,
      name: 'photos',
      formData: { user: 'test' },
      success(res) {
        console.log(res.data);
        const data = JSON.parse(res.data);
        const { fileList } = that.data;//获取原文件列表
        fileList.push({ url: data.url });
        // 上传完成需要更新 fileList
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