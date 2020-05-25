<template>
  <view class="detail-container">
    <!-- <y-swiper :imageURLs="detail.imageURLs"></y-swiper> -->

    <view class="car_detail">
      <view class="car_detail_head">{{ detail.carInfo.carTitle }}</view>
      <view class="car_price_box" v-if="showPrice">
        <view class="car_price">
          {{ detail.startPrice }}
          <i class="wan">万</i>
        </view>
        <view class="new_car_price">新车含税{{ detail.carType.price }}</view>
        <view v-if="!reachReserve" style="color:grey">{{ socketText }}</view>
      </view>
    </view>

    <y-auction
      ref="auction" 
      :prePrice="detail.prePrice/10000 || ''"
      :carid="detail.carInfo.plateNum" 
      :time2="detail.stageStartTime"
      :startPrice="detail.startPrice"
      @changePrice="onChangePrice" 
      @changeCar="onChangeCar" 
      v-if="showPrice"
      >
    </y-auction>
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
//import ySwiper from '../../components/yswiper/yswiper';
global['__wxVueOptions'] = {
  components: {
    //'y-swiper': ySwiper,
    'y-auction': yAuction,
    'y-cartype': yCartype,
    'y-carinfo': yCarinfo
  }
};
global['__wxRoute'] = 'pages/detail/detail';
const app = getApp();
const { request } = require('../../utils/util.js');

Page({
  data: {
    socketText: '当前价格未到保留价',
    reachReserve: false,
    detail: { carInfo: {}, carType: {} },
    isAdmin: false,
    carid: null,
    showPrice: true
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

  // // page lifetimes start -----------------------------------------------------------------------------------
  onLoad(options) {
    //console.log('page/detail/onLoad()/options: ', options);
    this.loadPage();
    if(app.globalData.review)this.setData({ showPrice: false });
  },

  onReady() {
    //console.log('page/detail/onReady()/app.globalData.carid = ', app.globalData.carid);
    //this.loadPage();
    //console.log('$refs.auction: ', this.$refs.auction);
    //this.$refs.auction.reconnectSocket();
    //console.log("this.refs.auction.socketTask: ", this.$refs.auction.socketTask)
  },

  onHide() {
    //console.log('page/detail/onHide()');
    //console.log("this.refs.auction.socketTask: ", this.$refs.auction.socketTask)
    //this.$refs.auction.socketTask.close();
  },

  onShow() {
    //console.log('pages/detail/onShow()');
    //console.log("this.refs.auction.socketTask: ", this.$refs.auction.socketTask)
    //this.$refs.auction.sayHello();
  },

  onTabItemTap(item) {
    //console.log('page/detail/onTabItemTap()/item: ', item);
    //app.globalData.carid = null;
    this.loadPage(null);
  },

  // page lifetimes end ----------------------------------------------------------------------------------------
  loadPage(carid = app.globalData.carid) {
    const that = this;
    console.log('load(carid = %s)', carid);
    wx.showLoading({ title: '正在加载' });
    return request('/get-stage', { carid })
      .then(res => {
        // res.data : { code: 0, msg: "ok", car: {} }
        console.log('get-stage: ', res.data);
        const { code, msg, content } = res.data;
        wx.hideLoading();
        if (code) {
          //const carid = content.carInfo.plateNum;
          //app.globalData.carid = content.carInfo.plateNum;
          that.setData({ detail: content });
          that.showPrice && that.$refs.auction.sayHello();
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
