<template>
  <view>
    <view style="background-color: #777777;line-height: 2;text-align: center;"><text style="color: #FFFFFF;font-size: 16px;flex: 1;">录入二手车信息</text></view>

    <!-- <yu-datetime-picker ref="dateTime" startYear="2018" :isAll="true" :current="true" @confirm="onConfirmDateTime"></yu-datetime-picker> -->

    <van-cell-group title="行驶证信息：">
      <van-field :value="car.plateNum" maxlength="10" label="车牌号码：" @change="onChange" data-id="plateNum"></van-field>
      <!-- <van-field :value="car.vehicleType" maxlength="10" label="车辆类型：" @change="onChange" data-id="vehicleType"></van-field>
      <van-field :value="car.owner" maxlength="10" label="所有人：" @change="onChange" data-id="owner"></van-field>
      <van-field :value="car.addr" type="textarea" autosize maxlength="50" label="住  址：" @change="onChange" data-id="addr"></van-field>
      <van-field :value="car.useCharacter" maxlength="10" label="使用性质：" @change="onChange" data-id="useCharacter"></van-field>
      <van-field :value="car.model" maxlength="10" label="品牌型号：" @change="onChange" data-id="model"></van-field>
      <van-field :value="car.engineNum" maxlength="10" label="发动机号：" @change="onChange" data-id="engineNum"></van-field> -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">注册日期：</view>
          <view class="uni-list-cell-db">
            <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
              <view class="uni-input">{{ date }}</view>
            </picker>
          </view>
        </view>
      </view>
      <!-- <van-field :value="car.registerDate" maxlength="10" label="注册日期：" @change="onChange" data-id="registerDate" @focus="popDateTime"></van-field> -->
      <van-field :value="car.vin" maxlength="20" label="识别代号：" @change="onChange" data-id="vin">
        <van-button slot="button" size="small" type="primary" @tap="getCarType" v-if="!b[0]">获取车型信息</van-button>
      </van-field>
    </van-cell-group>

    <y-cartype show="field" :carType="carType" @confirm="onConfirm" v-if="b[0]"></y-cartype>

    <block v-if="b[1]">
      <van-cell-group :title="fileLists[0].length == 0 ? '请上传外观照片' : '已上传外观照片：'">
        <van-uploader data-id="0" :file-list="fileLists[0]" @after-read="afterRead" @delete="deletePhoto"></van-uploader>
      </van-cell-group>

      <van-cell-group :title="fileLists[1].length == 0 ? '请上传驾驶舱照片' : '已上传驾驶舱照片：'">
        <van-uploader data-id="1" :file-list="fileLists[1]" @after-read="afterRead" @delete="deletePhoto"></van-uploader>
      </van-cell-group>

      <van-cell-group :title="fileLists[2].length == 0 ? '请上传发动机舱照片' : '已上传发动机舱照片：'">
        <van-uploader data-id="2" :file-list="fileLists[2]" @after-read="afterRead" @delete="deletePhoto"></van-uploader>
      </van-cell-group>
    </block>

    <van-cell-group title="车辆展示信息：" v-if="b[2]">
      <van-field :value="car.carTitle" maxlength="20" label="描述标题：" placeholder="请输入车辆描述标题" @change="onChange" data-id="carTitle" required></van-field>
      <van-field
        :value="car.mileage"
        maxlength="10"
        label="行驶里程："
        type="number"
        placeholder="请输入车辆行驶里程（公里）"
        @change="onChange"
        data-id="mileage"
        required
      ></van-field>
      <van-field
        :value="car.carDescrible"
        maxlength="200"
        autosize
        type="textarea"
        label="详细描述："
        placeholder="请输入小于200字的车况描述"
        @change="onChange"
        data-id="carDescrible"
      ></van-field>
    </van-cell-group>

    <van-button block type="primary" @click="saveCar" :disabled="!b[3]">保存以上信息</van-button>
  </view>
</template>

<script>
import yCartype from '../../components/cartype/cartype';
import yuDatetimePicker from '@/components/yu-datetime-picker/yu-datetime-picker.vue';
global['__wxVueOptions'] = { components: { 'y-cartype': yCartype, yuDatetimePicker } };
global['__wxRoute'] = 'pages/upload/upload';
const { inQyweixin, request } = require('../../utils/util.js');
const app = getApp();
const host = app.globalData.host;

Page({
  data: {
    //{ url: 'http://iph.href.lu/60x60?text=default', name: '图片2', isImage: true }
    fileLists: [[], [], []],
    car: {
      plateNum: '云A',
      vehicleType: '',
      owner: '',
      addr: '',
      useCharacter: '',
      model: '',
      vin: 'LVSHBFAF29F066713',
      engineNum: '',
      registerDate: '',
      carTitle: '',
      mileage: 0,
      carDescrible: ''
    },
    carType: {},
    b: [0, 0, 0, 0],
    date: null,
    startDate: getDate('start'),
    endDate: getDate('end')
  },

  bindDateChange(e) {
    console.log('dateChange: ', e);
    const date = e.target.value;
    this.setData({ date, "car.registerDate": date });
  },

  onLoad(options) {
    console.log('inQyweixin: ', inQyweixin());
  },

  onChange(e) {
    //console.log("onChange event: ", e);
    this.setData({ [`car.${e.currentTarget.dataset.id}`]: e.detail });
    //console.log("this.car: ", this.car);
    if (this.car.mileage) this.setData({ 'b[3]': 1 });
  },

  // upload photos
  afterRead(e) {
    const that = this;
    const { file } = e.detail;
    const index = parseInt(e.target.dataset.id);
    console.log(file);
    //fileList.push({ ...file, url: file.path });
    //return 0;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: host + '/upload-photos',
      filePath: file.path,
      name: 'photos',
      formData: {
        sid: app.globalData.sid,
        tagId: index,
        car_plat_num: that.data.car.plateNum
      },
      success(res) {
        console.log(res.data);
        const data = JSON.parse(res.data);

        const fileLists = that.data.fileLists;
        if (fileLists.length < index + 1) fileLists.push([]);
        fileLists[index].push({ url: data.url, filename: data.filename });
        // 上传完成需要更新 fileList
        that.setData({ fileLists, 'b[2]': 1 });
      }
    });
  },

  deletePhoto(e) {
    const that = this;
    const index = e.detail.index;
    const id = parseInt(e.target.dataset.id);
    console.log('index: ', index, ' id: ', id);
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
    const userInfo = { nickName: 'admin' };
    const data = {
      data: {
        car: this.data.car,
        carType: this.data.carType,
        userInfo
      }
    };
    //console.log("saveCar(): ", data.data);
    request('/save-car', data)
      .then(res => {
        console.log('save-car: ', res.data);
        wx.redirectTo({ url: '../auctions/auctions?carid=' + this.data.car.plateNum });
      })
      .catch(err => console.log(err));
  },

  getCarType() {
    const that = this;
    //console.log("getCarType button: ", e.detail);
    const vin = that.car.vin;
    //get vin from server
    request('/vin', { vin })
      .then(r => {
        console.log('/vin: ', r.data);
        const carType = r.data.carType;
        that.setData({ carType, 'b[0]': 1 });
      })
      .catch(err => console.log(err));
  },

  onConfirm(e) {
    //console.log('onConfirm: ', e);
    this.setData({
      carType: e.detail,
      'car.carTitle': e.detail.name,
      'b[1]': 1
    });
  }
});

function getDate(type) {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === 'start') {
    year = year - 30;
  } else if (type === 'end') {
    //year = year + 2;
  }
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  return `${year}-${month}-${day}`;
}

export default global['__wxComponents']['pages/upload/upload'];
</script>

<style>
@import './upload.css';
</style>
