const { inQyweixin, request } = require('../../utils/util.js');
const app = getApp();
const host = app.globalData.host;

Page({
  data: {
    //{ url: 'http://iph.href.lu/60x60?text=default', name: '图片2', isImage: true }
    fileLists: [ [], [], [] ],
    car: { plateNum: '云A00001', vin: "LVSHBFAF29F066713" },
    carType: {},
    b: [0, 0, 0, 0]
  },

  onChange(e){
    console.log("onChange: ", e);
    e.target.id == "mileage" ? this.setData({ [`car.${e.target.id}`]: e.detail, "b[3]": 1 }) : this.setData({ [`car.${e.target.id}`]: e.detail });  
  },

  // upload photos
  afterRead: function(e) {
    // const car_plat_num = this.data.car.plat_num;
    // this.setData({ "car.plat_num": car_plat_num });
    // if(!car_plat_num){
    //   wx.showToast({ title: '请扫描行驶证！', duration: 2000 });
    //   return 0;
    // }
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
      formData: { sid: app.globalData.sid, tagId: index, car_plat_num: that.data.car.plateNum },
      success(res) {
        console.log(res.data);
        const data = JSON.parse(res.data);

        const fileLists = that.data.fileLists;
        if (fileLists.length < index + 1) fileLists.push([]);
        fileLists[index].push({ url: data.url, filename: data.filename });
        // 上传完成需要更新 fileList
        that.setData({ fileLists, "b[2]": 1 });
        //that.setData({ [`fileLists[${index}]`]: fileList });
      }
    });
  },

  driverSuccess: function(e) {
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
      success: function(res) {
        console.log(res.data);
        // delete photo from client
        const fileList = that.data.fileLists[id];
        fileList.splice(index, 1);
        //that.setData({ fileList });
        that.setData({ [`fileLists[${id}]`]: fileList });
      }
    });
  },

  saveCar(e) {
    const userinfo = e.detail;
    console.log("bindgetuserinfo: ", userinfo);

    // check user auther
    if (userinfo.errMsg != "getUserInfo:ok"){
      wx.showToast({
        title: '请同意授权用户信息！',
        duration: 2000
      });
      return 0;
    }

    const data ={ data: { car: this.data.car, carType: this.data.carType, userinfo } };
    console.log("saveCar(): ", data.data);
    request('/save-car', data).then(res => {
      console.log("save-car: ", res.data);
      wx.redirectTo({ url: '../auctions/auctions?carid=' + this.data.car.plateNum });
    }).catch(err => console.log(err));
  },

  getCarType(){
    //console.log("getCarType button: ", e.detail);
    const vin = this.data.car.vin;
    //get vin from server
    request('/vin', { vin }).then(r => {
      console.log("/vin: ", r.data);
      const carType = r.data.carType;
      this.setData({ carType, "b[0]": 1 });
    }).catch(err => console.log(err));
  },

  onConfirm(e){
    //console.log('onConfirm: ', e);
    this.setData({ carType: e.detail, "car.carTitle": e.detail.name, "b[1]": 1 });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log("inQyweixin: ", inQyweixin());
    //getCarType("LVSHBFAF29F066713");
  }
});