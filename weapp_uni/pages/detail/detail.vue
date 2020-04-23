<template>
  <view class="detail-container">
    <!-- <y-swiper :imageURLs="detail.imageURLs"></y-swiper> -->

    <view class="car_detail">
      <view class="car_detail_head">{{ detail.carInfo.carTitle }}</view>
      <view class="car_price_box">
        <view class="car_price">
          {{ detail.startPrice }}
          <i class="wan">万</i>
        </view>
        <view class="new_car_price">新车含税{{ detail.carType.price }}</view>
        <view v-if="!reachReserve" style="color:grey">{{ socketText }}</view>
      </view>
    </view>

    <y-auction ref="auction" :carid="detail.carInfo.plateNum" :time2="detail.stageStartTime" @changePrice="onChangePrice" @changeCar="onChangeCar"></y-auction>
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
import yAuction from '../../components/auction/auction';
import yCartype from '../../components/cartype/cartype';
import yCarinfo from '../../components/carinfo/carinfo';
import ySwiper from '../../components/yswiper/yswiper';
global['__wxVueOptions'] = { components: { 'y-auction': yAuction, 'y-cartype': yCartype, 'y-carinfo': yCarinfo, 'y-swiper': ySwiper } };
global['__wxRoute'] = 'pages/detail/detail';
const app = getApp();
const { request } = require('../../utils/util.js');

Page({
  data: {
    socketText: '当前价格未到保留价',
    reachReserve: false,
    detail: { carInfo: {}, carType: {} },
    isAdmin: false,
    carid: null
  },

  onChangePrice(e) {
    console.log('newPrice: ', e.detail);
    this.setData({ 'detail.startPrice': e.detail.price / 10000, reachReserve: e.detail.reachReserve });
  },

  onChangeCar(e) {
    console.log('onChangeCar', e.detail);
    //app.globalData.carid = e.detail.carid;
    //wx.reLaunch({ url: 'detail' });
    this.loadPage(e.detail.carid);
  },

  // page lifetimes start -----------------------------------------------------------------------------------
  onLoad(options) {
    console.log('page/detail/onLoad()/options: ', options);
    this.loadPage();
  },

  onReady() {
    console.log('page/detail/onReady()/app.globalData.carid = ', app.globalData.carid);
    //this.loadPage();
    //console.log('$refs.auction: ', this.$refs.auction);
    //this.$refs.auction.sayHello();
  },

  onHide() {
    console.log('page/detail/onHide()');
    //this.$refs.auction.socketClose();
  },

  onShow() {
    console.log('pages/detail/onShow()');
    //this.$refs.auction.sayHello();
  },

  onTabItemTap(item) {
    console.log('page/detail/onTabItemTap()/item: ', item);
    //app.globalData.carid = null;
    this.loadPage(null);
  },

  // page lifetimes end ----------------------------------------------------------------------------------------
  loadPage(carid = app.globalData.carid) {
    const that = this;
    console.log('load(carid = %s)', carid);
    wx.showLoading({ title: '正在加载' });
    request('/get-stage', { carid })
      .then(res => {
        // res.data : { code: 0, msg: "ok", car: {} }
        console.log('get-stage: ', res.data);
        const { code, msg, content } = res.data;
        wx.hideLoading();
        if (code) {
          //const carid = content.carInfo.plateNum;
          //app.globalData.carid = content.carInfo.plateNum;
          that.setData({ detail: content }, () => that.$refs.auction.sayHello());
        } else {
          // no auction car
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: () => {
              wx.switchTab({ url: '../sale/sales' });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
      });
  },

  previewImg(e) {
    const index = e.currentTarget.dataset.index;
    const imgArr = this.data.detail.imageURLs;
    wx.previewImage({ current: imgArr[index], urls: imgArr });
  }
});

export default global['__wxComponents']['pages/detail/detail'];
</script>

<style>
@import './detail.css';
</style>
