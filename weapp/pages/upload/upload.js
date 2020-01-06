const { inQyweixin } = require('../../utils/util.js');
const app = getApp();
const host = app.globalData.host;

Page({
  data: {
    //{ url: 'http://iph.href.lu/60x60?text=default', name: '图片2', isImage: true }
    fileLists: [[]],
    car: {},
    operator: { name: "张飞", mobile: "13705553110" }
  },

  afterRead: function(e){
    //console.log("afterRead event: ", e);
    const that = this;
    const { file } = e.detail;
    const index = parseInt(e.target.id);
    console.log(file);
    //fileList.push({ ...file, url: file.path });
    //return 0;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: host + '/upload-photos',
      filePath: file.path,
      name: 'photos',
      formData: { user: 'test', tagId: index },
      success(res) {
        console.log(res.data);
        const data = JSON.parse(res.data);

        const fileLists = that.data.fileLists;
        if(fileLists.length < index +1 )fileLists.push([]);
        fileLists[index].push({ url: data.url, filename: data.filename });
        // 上传完成需要更新 fileList
        that.setData({ fileLists });
        //that.setData({ [`fileLists[${index}]`]: fileList });
      }
    });
  },

  driverSuccess: function (e) {
    console.log("driver info: ", e);
    const drLic = e.detail;
    const car = {
      plateNum: drLic.plate_num.text,
      vehicleType: drLic.vehicle_type.text,
      owner: drLic.owner.text,
      addr: drLic.addr.text,
      useCharacter: drLic.use_character.text,
      model: drLic.model.text,
      vin: drLic.vin.text,
      engineNum: drLic.engine_num.text,
      registerDate: drLic.register_date.text
    };
    console.log("car", car);
    this.setData({ car });
  },

  deletePhoto(e) {
    const that = this;
    const index = e.detail.index;
    const id = parseInt(e.target.id);
    console.log("index: ", index, " id: ", id);
    //return 0;
    // delete photo from server
    wx.request({
      url: host + '/delete-photo',
      data: { filename: that.data.fileLists[id][index].filename },
      success: function (res) {
        console.log(res.data);
        // delete photo from client
        const fileList = that.data.fileLists[id];
        fileList.splice(index, 1);
        //that.setData({ fileList });
        that.setData({ [`fileLists[${id}]`]: fileList });
      }
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("inQyweixin: ", inQyweixin());
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
});