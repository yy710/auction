const app =getApp();
const { request } = require('../../utils/util.js');
// create function of set stage.dateString for stages, stage.start_time is not a date object
const setStages = _setStages(getDateString);

Page({
  data: {
    minDate: nextDay(),
    maxDate: nextMonth(),
    formatter(type, value) {
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
    },
    startPrice: null,
    reservePrice: null,
    showPop: false,
    stages: [],
    currentStage: null,
    radio: 1,
    currentDate: new Date().getTime(),
    platNum: null
  },

  showPopup() {
    const currentDate = this.data.currentStage.start_time;
    this.setData({ currentDate,  showPop: true });
  },

  onClose() {
    this.setData({ showPop: false });
  },

  onInput(event) {
    console.log("onInput(): ", event);
  },

  onConfirm(event) {
    const date = event.detail;
    let stages = this.data.stages;
    const index = parseInt(this.data.radio) - 1;
    const currentStage = stages[index];
    //console.log("event.detail: ", date);
    //console.log("index: ", index);
    (stages.length > 0) && (currentStage.start_time = date);
    stages = setStages(stages);
    this.setData({ stages, currentStage });
    // save to db of server
    wx.request({
      url: app.globalData.host + '/update-stage-start-time',
      data: currentStage,
      success: res => {
        console.log("update-stage: ", res.data);
      }
    })
    this.onClose();
  },

  onCancel(){
    this.setData({ currentDate: new Date().getTime(), minDate: nextDay() });
    this.onClose();
  },

  saveStage(){
    // send data to server
    wx.request({
      url: app.globalData.host +  '/save-stage',
      data: {
        startPrice: this.data.startPrice,
        reservePrice: this.data.reservePrice,
        stageid: this.data.currentStage.id,
        platNum: this.data.platNum
      },
      success: res => {
        console.log("save-stage: ", res.data);
        wx.switchTab({ url: '../upload/upload' });
        //wx.navigateTo({ url: '../upload/upload' });
      }
    })
  },

  addStage(){
    let stages = this.data.stages;
    const id = stages.length + 1;
    const newStage = {
      app_token: 'yz_auction',
      id,
      start_time: new Date().getTime(),
      state: 1,
      reserve_time: 2*60,
      auction_time: 20,
      current_auction: {},
      auctions: []
    };
    //stages.push(newStage);

    request('/add-stage', { newStage }).then(res => {
      console.log("add-stage: ", res.data);
      this.getStages();
    }).catch(err => console.log(err));

    // wx.request({
    //   url: app.globalData.host + '/add-stage',
    //   data: { newStage },
    //   success: res => {
    //     console.log("add-stage: ", res.data);
    //     this.getStages();
    //   }
    // });

    //stages = setStages(stages);
    //this.setData({ stages, radio: id });
  },

  onChange2(event) {
    console.log("onChange: ", event);
    this.setData({ [event.target.dataset.field]: event.detail });
  },

  onChange(event) {
    console.log(event);
    //this.setData({ radio: event.detail });
  },

  onClick(event) {
    console.log("onClick: ", event);
    const { name } = event.currentTarget.dataset;
    const currentStage = this.data.stages[name-1];
    this.setData({ radio: name, currentStage });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    console.log('onLoad options: ', options);
    this.setData({ platNum: options.carid });
    this.getStages();
  },

  getStages() {
    wx.request({
      url: app.globalData.host + '/get-stages',
      success: res => {
        console.log("get-stages: ", res.data);

        const _stages = res.data.stages || [];
        const stages = setStages(_stages);
        this.setData({ stages, currentStage: stages[0] || [] });

        //console.log("!!data.stages ", !!this.data.stages);
      }
    });
  }
});

function getDateString(_date) {
  const date = new Date(parseInt(_date));
  return date.toLocaleString();
}

function _setStages(f){
  return function(stages){
    return stages.map(stage => {
      stage.dateString = f(stage.start_time);
      stage.start_time = parseInt(stage.start_time);
      return stage;
    });
  };
}

function nextDay(){
  return new Date().getTime() + 24*60*60*1000;
}

function nextMonth(){
  return new Date().getTime() + 30*24*60*60*1000;
}