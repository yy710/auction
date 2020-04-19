<template>
<!--pages/fenqi/fenqi.wxml-->
<view class="fenqi-container">
  <view class="fenqi-banner">
    <image mode="scaleToFill" src="/static/images/fenqi/fenqi.jpg" style="width:100%;height:165px"></image>
  </view>
  <view class="fenqi-price">
    <view class="fenqi-price-title">{{detail.title}}</view>
    <view class="fenqi-price-total">全价：{{detail.oldPrice}}万元</view>
  </view>
  <view class="fenqi-detail-container">
    <view class="fenqi-detail-title">首付<span class="fenqi-detail-title-span">{{detail.firstPay}}</span>万</view>
    <view class="fenqi-detail-content-container">
      <view class="fenqi-detail-content">
        <view class="fenqi-label">分期方案</view>
        <view class="fenqi-label">月供{{detail.mPay}}元</view>
        <view class="fenqi-label">{{detail.payTime}}期</view>
      </view>
    </view>
    <view class="fenqi-detail">首付以您通过信审后的实际价格为准,首付比例以实际金融方案为准</view>
  </view>
  <view style="height:10px;width:100%;background-color: #f2f2f2"></view>
  <view class="fenqi-need">
    <view style="height:20px;width:100%;"></view>
    <view class="fenqi-need-title">
      <view class="fenqi-line"></view>
      <view class="fenqi-text">申请流程</view>
    </view>
    <view class="fenqi-item-box">
      <view class="fenqi-item-title">提交申请</view>
      <view class="fenqi-item-detail">线上提交基础信息后，我们会第一时间为您安排专属购车顾问提供1对1服务</view>
    </view>
    <view class="fenqi-item-box">
      <view class="fenqi-item-title">极速审批</view>
      <view class="fenqi-item-detail">线下预约看车，在购车顾问协助下提交身份证、驾驶证、借记卡信息，最快60分钟即可查看审批结果</view>
    </view>
    <view class="fenqi-item-box">
      <view class="fenqi-item-title">一站提车</view>
      <view class="fenqi-item-detail">确定成交意向后，优信为您提供包括合同签署、车辆过户、抵押办理在内的一站式服务</view>
    </view>
    <view style="height:100px;width:100%;"></view>
  </view>
  <view class="footer-box">
    <view class="footer-button">
      <button @tap="phoneCallEvent" class="share-btn">电话联系</button>
    </view>
    <view class="footer-button">
      <button open-type="contact" class="contact-btn">联系客服</button>
    </view>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/fenqi/fenqi';
// pages/fenqi/fenqi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonecall: '13888888888',
    detail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getFenqi(this, options.carid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  phoneCallEvent(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall
    })
  }
})
function getFenqi(page, carid) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在加载',
  })
  wx.request({
    url: host+'/getfenqi',
    method: "POST",
    data: {
      carid: carid,
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      var code = res.data.code
      wx.hideLoading()
      if (code === 0) {
        console.log("content:", res.data.content[0].title)
        page.setData({
          detail: res.data.content[0]
        }
        )

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function (e) {
      console.log(e);
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    },
  })
}
export default global['__wxComponents']['pages/fenqi/fenqi'];
</script>
<style>
@import "./fenqi.css";
</style>