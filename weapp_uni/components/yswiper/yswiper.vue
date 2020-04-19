<template>
<view>
<view class="swiper-container" v-if="!video.video_url">

  <swiper class="swiper_box" :autoplay="autoplay" :interval="interval" :duration="duration" circular>
    <block v-for="(item, index) in imageURLs" :key="index">
      <swiper-item>
        <image :src="item" class="slide-image" width="355" height="150" mode="aspectFit" lazy-load="true"></image>
      </swiper-item>
    </block>
  </swiper>

  <!--
    <view class="dots">
      <block wx:for="{{detail.imageURLs}}" wx:key="unique">
        <view class="dot{{index == swiperCurrent ? ' active' : ''}}"></view>
      </block>
    </view>
    
    <view wx:if="{{detail.isSaled}}" class='saled-container'>
      <image src='../../images/detail/saled.png' style='height:100%;width:100%'></image>
    </view>
    -->

</view>

<view class="swiper-container" v-if="video.video_url">
  <video :src="video.video_url" style="width:100%"></video>
</view>
</view>
</template>


<script>

global['__wxRoute'] = 'components/yswiper/yswiper';
Component({
  properties: {
    imageURLs: {
      type: Array,
      value: ['../../images/home/car1.jpg', '../../images/home/car2.jpg'],
      observer(newVal, oldVal){}
    },
    video: {
      type: Object,
      value: { video_url: '' }
    }
  },

  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000
  },

  methods: {

  }
})

export default global['__wxComponents']['components/yswiper/yswiper'];
</script>
<style>
@import "./yswiper.css";
</style>