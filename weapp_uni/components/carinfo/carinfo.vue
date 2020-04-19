<template>
<view class="car_info_box">

  <view class="car_info_title">
    <view class="title_label"></view>
    <view class="title_info">车况信息</view>
  </view>

  <view class="car_info">

   <text style="color:#757f89font-size:16pxpadding: 10pxtext-indent: 2em">此车行驶里程{{carInfo.mileage}}公里，上牌时间为{{carInfo.registerDate}}。车况描述：{{carInfo.carDescrible}}</text>

    <!-- <view class='car_info_item_box'>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text5" style="color:#abafb3;font-size:14px">行驶里程</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.gongLi}} 万公里</text>
        </view>
      </view>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text11" style="color:#abafb3;font-size:14px">新车价</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.oldPrice}}万</text>
        </view>
      </view>
    </view>

    <view class='car_info_item_box'>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text5" style="color:#abafb3;font-size:14px">上牌时间</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.carTime}}</text>
        </view>
      </view>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text11" style="color:#abafb3;font-size:14px">档位/排量</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.dang}}/{{detail.pailiang}}</text>
        </view>
      </view>
    </view>

    <view class='car_info_item_box'>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text5" style="color:#abafb3;font-size:14px">上牌地</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.city}}</text>
        </view>
      </view>
      <view class='car_info_item'>
        <view class='car_info_item_title'>
          <text id="text11" style="color:#abafb3;font-size:14px">排放标准</text>
        </view>
        <view class='car_info_item_content'>
          <text style="color:#757f89;font-size:16px;font-weight: bold">{{detail.carOut}}</text>
        </view>
      </view>
    </view> -->

  </view>

  <!-- <view class='car_info_link'>
    <view style='flex:2'></view>
    <label style="flex:1;color:#4ea2ff;font-size:16px;font-weight: bold;margin-right:10px" bindtap="dispatchBind">检测报告 >></label>
  </view> -->

</view>
</template>


<script>

global['__wxRoute'] = 'components/carinfo/carinfo';
Component({
  properties: {
    carInfo: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {}
    }
  },

  data: {

  },

  methods: {

  }
})
export default global['__wxComponents']['components/carinfo/carinfo'];
</script>
<style>
@import "./carinfo.css";
</style>