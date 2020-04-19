<template>
<view class="detail-container">
 
  <!-- <y-swiper :imageURLs="detail.imageURLs"></y-swiper> -->

  <view class="car_detail">
    <view class="car_detail_head">{{detail.carInfo.carTitle}}</view>
    <view class="car_price_box">
      <view class="car_price">{{detail.startPrice}}<i class="wan">万</i>
      </view>
      <view class="new_car_price">新车含税{{detail.carType.price}}</view>
      <view v-if="!reachReserve" style="color:grey">{{socketText}}</view>
    </view>
  </view>

 <y-auction :carid="carid" :time2="detail.stageStartTime" @changePrice="onChangePrice" @changeCar="onChangeCar"></y-auction>
 <y-carinfo :carInfo="detail.carInfo"></y-carinfo>
 <y-cartype show="cell" :carType="detail.carType"></y-cartype>

  <!-- show photos of car -->
  <view class="car_image_container">
    <view style="height:10px;width:100%;"></view>
    <view class="car_image_box" v-for="(item, index) in detail.imageURLs" :key="index">
      <image mode="widthFix" class="car_image" :src="item" :data-index="index" @tap="previewImg"></image>
    </view>
  </view>

</view>
</template>

<script>
import yAuction from '../../components/auction/auction'
import yCartype from '../../components/cartype/cartype'
import yCarinfo from '../../components/carinfo/carinfo'
import ySwiper from '../../components/yswiper/yswiper'
global['__wxVueOptions'] = {components:{'y-auction': yAuction,'y-cartype': yCartype,'y-carinfo': yCarinfo,'y-swiper': ySwiper}};
global['__wxRoute'] = 'pages/detail/detail';
const app = getApp();
const { request } = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    socketText: '当前价格未到保留价',
    reachReserve: false,
    detail: { carInfo: {}, carType: {} },
    isAdmin: false,
    carid: null
  },

  onChangePrice(e){
    console.log("newPrice: ", e.detail);
    this.setData({ "detail.startPrice": e.detail.price/10000, "reachReserve": e.detail.reachReserve });
  },

  onChangeCar(e){
    console.log("onChangeCar", e.detail);
    wx.reLaunch({ url: 'detail?carid=' + e.detail.carid });
  },

  getUserInfo: function(e) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({ userInfo: e.detail.userInfo, hasUserInfo: true });
  },

  onLoad: function(options) {
    console.log("onLoad options: ", options);
    const carid = options.carid;
    // init auction of component
    //this.setData({ carid });
    wx.showLoading({ title: '正在加载' });
    getStage(this, carid)
    .then(detail => {
      wx.hideLoading();
      this.setData({ detail, carid });
      })
    .catch(err => console.log(err));
  },

  onShow(){
    console.log("page detail onShow!");
    //getStage(this, this.data.carid);
  },

  onHide(){
    console.log("page detail onHide!");
    this.setData({ carid: null });
  },

  dispatchBind() {
    var carid = this.data.carid;
    wx.switchTab({ url: '/pages/report/report?carid=' + carid });
  },

  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.detail.imageURLs;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    });
  },

  handleDelete() {
    const carid = this.data.carid;
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function(res) {
        if (res.confirm) {
          deleteCar(this, carid)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  handleUnable() {
    const carid = this.data.carid;
    wx.showModal({ 
      title: '提示',
      content: '是否确认下架？',
      success: function(res) {
        if (res.confirm) {
          unableCar(this, carid);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
});

// -----------------------------------------------------
function getStage(page, carid) {
  if(!carid)return 0;
  return request('/get-stage', { carid }).then(res => {
    // res.data : { code: 0, msg: "ok", car: {} }
    console.log("get-stage: ", res.data);
    const code = res.data.code;
    if (code === 0) {
      const detail = res.data.content;
      return detail;
      //page.setData({ detail });
    } else {
      wx.showModal({ title: '提示', content: res.data.msg, showCancel: false });
    }
  }).catch(err => {
    console.log(err);
    wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  });
}

function deleteCar(page, carid) {
  var appInstance = getApp();
  var host = appInstance.globalData.host;
  wx.request({
    url: host + '/deleteCar',
    method: "POST",
    data: { carid: carid },
    header: { "Content-Type": "application/json" },
    success: function(res) {
      var code = res.data.code
      if (code === 0) {
        wx.showToast({ title: '删除成功', icon: 'success', duration: 2000 })
      } else {
        wx.showModal({ title: '提示', content: res.data.msg, showCancel: false })
      }
    },
    fail: function(e) {
      console.log(e);
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false })
    }
  });
}

function unableCar(page, carid) {
  var appInstance = getApp();
  var host = appInstance.globalData.host;
  wx.request({
    url: host + '/unableCar',
    method: "POST",
    data: { carid: carid },
    header: { "Content-Type": "application/json" },
    success: function(res) {
      var code = res.data.code;
      if (code === 0) {
        wx.showToast({ title: '下架成功', icon: 'success', duration: 2000 });
      } else {
        wx.showModal({ title: '提示', content: res.data.msg, showCancel: false });
      }
    },
    fail: function(e) {
      console.log(e);
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false })
    }
  });
}
export default global['__wxComponents']['pages/detail/detail'];
</script>

<style>
@import "./detail.css";
</style>