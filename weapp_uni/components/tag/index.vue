<template>
<view @tap="onTap" class="container tag-class">
  <text>{{text}}</text>
  <slot class="after" name="after"></slot>
</view>
</template>


<script>

global['__wxRoute'] = 'components/tag/index';
// components/tag/tag.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
   externalClasses:['tag-class'],
  /**
   * 组件的属性列表
   */
  properties: {
   
    text:String
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
    onTap:function(event){
      this.triggerEvent('tapping',{
        text:this.properties.text
      })
    }
  }
})

export default global['__wxComponents']['components/tag/index'];
</script>
<style>
@import "./index.css";
</style>