<template>
<view>
<button @getuserinfo="onGetUserInfo" :open-type="openType" plain="true" class="container">
  <slot name="img"></slot>
</button>
</view>
</template>


<script>

global['__wxRoute'] = 'components/image-button/index';
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  // externalClasses: ['ex-btn-class'],
  properties: {
    openType: {
      type: String
    },
    imageSrc: {
      type: String
    },
    bindgetuserinfo: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  

  /**
   * 组件的方法列表
   */
  methods: {
    onGetUserInfo(event) {
      this.triggerEvent('getuserinfo', event.detail, {})
    },
  }
})
export default global['__wxComponents']['components/image-button/index'];
</script>
<style>
@import "./index.css";
</style>