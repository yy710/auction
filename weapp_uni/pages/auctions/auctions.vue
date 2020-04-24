<template>
  <view>
    <yu-datetime-picker ref="dateTime" startYear="2020" :value="currentDate" :isAll="false" :current="false" @confirm="onConfirm"></yu-datetime-picker>

    <van-cell-group title="竞价价格设置">
      <van-field :value="startPrice" label="车辆起拍价" placeholder="请输入起拍价" type="number" border="false" data-field="startPrice" @change="onChange2"></van-field>
      <van-field :value="reservePrice" label="车辆保留价" placeholder="请输入保留价" type="digit" border="false" data-field="reservePrice" @change="onChange2"></van-field>
    </van-cell-group>

    <!-- <van-radio-group :value="radio">
      <van-cell-group title="选择所属竞价场次：">
        <van-cell v-for="(item, index) in stages" :key="item.id" :title="item.dateString" clickable :data-name="item.id" @click="onClick">
          <van-radio slot="right-icon" :name="item.id" shape="square" />
        </van-cell>
      </van-cell-group>
    </van-radio-group> -->

    <!-- <van-radio-group :value="radio" @change="radioChange">
      <van-radio v-for="(item, index) in stages" :key="item.id" :name="item.id">
        <text style="color:red; font-size: 22rpx;">{{ item.dateString }}</text>
      </van-radio>
    </van-radio-group> -->
    
    <van-divider contentPosition="left">竞价场次时间设置</van-divider>

    <view class="uni-list">
      <radio-group @change="radioChange">
        <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in stages" :key="item.id">
          <view><radio :value="item.id" :checked="index === current" /></view>
          <view>{{ item.dateString }}</view>
        </label>
      </radio-group>
    </view>

    <!-- <van-radio-group :value="radio" @change="radioChange">
      <van-radio name="2"><text style="color:red; font-size: 22rpx;">单选框 1</text></van-radio>
      <van-radio name="5"><text style="color:red; font-size: 22rpx;">单选框 2</text></van-radio>
      <van-radio name="8"><text style="color:red; font-size: 22rpx;">单选框 3</text></van-radio>
    </van-radio-group> -->

    <van-button @tap="showPopup">修改所选场次时间</van-button>
    <van-button @tap="addStage">增加新的竞价场次</van-button>
    <button type="primary" @tap="saveStage">确认竞价设置</button>
  </view>
</template>

<script>
import { RadioGroup, Radio, DatetimePicker } from 'vant';
import yuDatetimePicker from '@/components/yu-datetime-picker/yu-datetime-picker.vue';
global['__wxVueOptions'] = { components: { yuDatetimePicker, 'y-RadioGroup': RadioGroup, 'y-Radio': Radio, 'y-DatetimePicker': DatetimePicker } };
global['__wxRoute'] = 'pages/auctions/auctions';
const app = getApp();
const { request, formatTime } = require('../../utils/util.js');
// create function of set stage.dateString for stages, stage.start_time is not a date object
const setStages = _setStages(getDateString2);

Page({
  data: {
    minDate: nextDay(),
    maxDate: nextMonth(),
    startPrice: null,
    reservePrice: null,
    stages: [
      //{ id: "1", start_time: 1587608782659, dateString: new Date(1587608782659).toLocaleString() },
      //{ id: "2", start_time: 1588608782659, dateString: formatTime(new Date(1587608782659)) }
    ],
    currentStage: null,
    radio: '1',
    currentDate: '2019-11-10 08:30:00',
    platNum: null,
    current: 0
  },

  computed: {
    formatter2(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    }
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
    this.setData({ currentDate }, () => this.$refs.dateTime.show());
  },

  onClose() {
    this.setData({ showPop: false });
  },

  onInput(event) {
    console.log('onInput(): ', event);
  },

  onConfirm(e) {
    console.log('onConfirm/e: ', e);
    const date = new Date(e.selectRes.replace(/\-/g, '/')).getTime();
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

    if (!data.platNum) {
      console.log('save-stage/data: ', data);
      return 0;
    }

    wx.request({
      url: app.globalData.host + '/save-stage',
      data,
      success: res => {
        console.log('save-stage: ', res.data);
        wx.switchTab({ url: '../upload/upload' });
        //wx.navigateTo({ url: '../upload/upload' });
      }
    });
  },

  addStage() {
    const newStage = {
      app_token: 'yz_auction',
      start_time: new Date().getTime() + 24*60*60*1000,
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

  onLoad: function(options) {
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
        const currentStage = this.currentStage ? this.currentStage : (stages[0] || null);
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

function nextDay() {
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
}

function nextMonth() {
  return new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
}
export default global['__wxComponents']['pages/auctions/auctions'];
</script>
<style>
@import './auctions.css';
</style>
