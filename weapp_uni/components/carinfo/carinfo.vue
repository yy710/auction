<template>
<view class="car_info_box">
  <view class="car_info_title">
    <view class="title_label"></view>
    <view class="title_info">车况信息</view>
  </view>
  <view class="car_info">
   <text style="color:#757f89;font-size:16px;padding:10px;text-indent:2em">此车行驶里程{{carInfo.mileage}}公里，上牌时间为{{carInfo.registerDate}}。车况描述：{{carInfo.carDescrible}}</text>
  </view>
</view>
</template>

<script>
global['__wxRoute'] = 'components/carinfo/carinfo';
Component({
  properties: {
    carInfo: { type: Object, value: {}, observer(newVal, oldVal) {} }
  },

  data: {},

  methods: {}
})
export default global['__wxComponents']['components/carinfo/carinfo'];
</script>

<style>
@import "./carinfo.css";
</style>