<template>
  <view>
    <van-cell-group title="竞价价格设置">
      <van-field :value="startPrice" label="车辆起拍价" placeholder="请输入起拍价" type="number" border="false" data-field="startPrice" @change="onChange2"></van-field>
      <van-field :value="reservePrice" label="车辆保留价" placeholder="请输入保留价" type="number" border="false" data-field="reservePrice" @change="onChange2"></van-field>
    </van-cell-group>

    <van-divider contentPosition="left">竞价场次时间设置</van-divider>

    <view class="uni-list">
      <radio-group @change="radioChange">
        <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in stages" :key="item.id">
          <view><radio :value="item.id" :checked="index === current" /></view>
          <view>{{ item.dateString }}</view>
        </label>
      </radio-group>
    </view>

    <w-time-picker ref="picker" @confirm="onConfirm" @cancel="onCancel" />

    <van-button @tap="showPopup">修改所选场次时间</van-button>
    <van-button @tap="addStage">增加新的竞价场次</van-button>
    <button type="primary" @tap="saveStage">确认竞价设置</button>
  </view>
</template>

<script>
import wTimePicker from '@/components/w-time-picker/w-time-picker.vue';
global['__wxVueOptions'] = { components: { wTimePicker } };
global['__wxRoute'] = 'pages/auctions/auctions';
const app = getApp();
const { request, formatTime } = require('../../utils/util.js');
// create function of set stage.dateString for stages, stage.start_time is not a date object
const setStages = _setStages(getDateString2);

Page({
  data: {
    startPrice: null,
    reservePrice: null,
    stages: [
      //{ id: "1", start_time: 1587608782659, dateString: new Date(1587608782659).toLocaleString() },
      //{ id: "2", start_time: 1588608782659, dateString: formatTime(new Date(1587608782659)) }
    ],
    currentStage: null,
    radio: '1',
    platNum: null,
    current: 0
  },

  radioChange(event) {
    console.log('event.detail: ', event.detail);
    const name = event.detail.value;
    const currentStage = this.stages.find(s => s.id == name);
    this.setData({ radio: name, currentStage });
    console.log('this.radio: ', this.radio);
    console.log('this.currentStage: ', this.currentStage);
  },

  onClick(event) {
    console.log('onClick/name: ', event.currentTarget.dataset.name);
    const { name } = event.currentTarget.dataset;
    const currentStage = this.stages.find(s => s.id == name);
    this.setData({ radio: name, currentStage });
    console.log('this.radio: ', this.radio);
    console.log('this.currentStage: ', this.currentStage);
  },

  showPopup() {
    const currentDate = this.currentStage.dateString;
    console.log('currentDate: ', currentDate);
    this.setData({ currentDate });
    this.$refs.picker.show();
  },

  onClose() {
    this.setData({ showPop: false });
  },

  onInput(event) {
    console.log('onInput(): ', event);
  },

  onConfirm(e) {
    console.log('onConfirm/e: ', e);
    //return 0;
    const date = new Date(e.replace(/\-/g, '/')).getTime();
    const currentStage = this.currentStage;
    currentStage.start_time = date;
    delete currentStage.dateString;
    console.log('currentStage: ', currentStage);
    // save to db of server
    wx.request({
      url: app.globalData.host + '/update-stage-start-time',
      data: currentStage,
      success: res => {
        console.log('update-stage: ', res.data);
        this.getStages();
      }
    });
  },

  onCancel() {
    return 0;
    this.setData({ currentDate: new Date().getTime(), minDate: nextDay() });
    this.onClose();
  },

  saveStage() {
    // send data to server
    const data = {
      startPrice: this.data.startPrice,
      reservePrice: this.data.reservePrice,
      stageid: this.data.currentStage.id,
      platNum: this.data.platNum
    };
    console.log('save-stage/data: ', data);

    if (!data.platNum || !data.startPrice || !data.reservePrice || parseInt(data.startPrice) > parseInt(data.reservePrice)) {
      uni.showModal({
        title: '请填写竞拍价格！',
        showCancel: false,
        success:function(){
          //
        }
      });
    }else{
      wx.request({
        url: app.globalData.host + '/save-stage',
        data,
        success: res => {
          console.log('save-stage: ', res.data);
          uni.showToast({ 
            title: res.data.msg, 
            icon: 'success', 
            duration: 1000,
            success: () => wx.navigateTo({ url: '../upload/upload' })});
        }
      });
    }
  },

  addStage() {
    const newStage = {
      app_token: 'yz_auction',
      start_time: new Date().getTime() + 24 * 60 * 60 * 1000,
      state: 0,
      reserve_time: 2 * 60,
      auction_time: 20,
      current_auction: {},
      auctions: []
    };

    request('/add-stage', { newStage })
      .then(res => {
        console.log('add-stage: ', res.data);
        this.getStages();
      })
      .catch(err => console.log(err));
  },

  onChange2(event) {
    //console.log('onChange: ', event);
    this.setData({ [event.target.dataset.field]: event.detail });
  },

  onChange(event) {
    console.log(event);
    //this.setData({ radio: event.detail });
  },

  onLoad(options) {
    console.log('onLoad options: ', options);
    this.setData({ platNum: options.carid });
    this.getStages();
  },

  getStages() {
    wx.request({
      url: app.globalData.host + '/get-stages',
      success: res => {
        //console.log('get-stages: ', res.data);
        // add dateString
        const _stages = res.data.stages || [];
        const stages = setStages(_stages);
        const currentStage = this.currentStage ? this.currentStage : stages[0] || null;
        console.log('new stages: ', stages);
        console.log('currentStage: ', currentStage);
        this.setData({ stages, currentStage });
      }
    });
  }
});

function getDateString1(_date) {
  const date = new Date(parseInt(_date));
  return date.toLocaleString();
}

function getDateString2(_date) {
  const date = new Date(parseInt(_date));
  return formatTime(date);
}

function _setStages(f) {
  return function(stages) {
    return stages.map(stage => {
      let { id, start_time } = stage;
      const dateString = f(start_time);
      //id = parseInt(id);
      //stage.start_time = parseInt(stage.start_time);
      return { id, dateString, start_time };
    });
  };
}

export default global['__wxComponents']['pages/auctions/auctions'];
</script>
<style>
@import './auctions.css';

.test {
  text-align: center;
  padding: 10px 0;
}
button {
  margin: 20upx;
  font-size: 28upx;
}
</style>
