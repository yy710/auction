<template>
<!--pages/report/report.wxml-->
<view class="report-container">
  <view class="report-des">
    <view class="car-title">{{detail.title}}</view>
    <view class="car-des">
      <text style="margin:10px;">{{detail.description}}</text>
    </view>
  </view>
  <view class="report-detail">
    <view class="report-item-box">
      <view class="report-item-label">重大事故排查</view>
      <view class="report-item-des">车体骨架结构无变形、无扭曲、无更换、无烧焊、无褶皱；无火烧痕迹，无水泡痕迹。</view>
      <view style="height:10px;width:100%;"></view>

      <!--事故排查-->
      <view class="report-item" @tap="showForm" id="1">
        <view class="report-item-title">排除重大事故</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[0].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom1 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom1 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[0].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--排除火烧车-->
      <view class="report-item" @tap="showForm" id="2">
        <view class="report-item-title">排除火烧车</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[1].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom2 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom2 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[1].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--排除水泡车-->
      <view class="report-item" @tap="showForm" id="3">
        <view class="report-item-title">排除水泡车</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[2].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom3 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom3 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[2].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>
    </view>
    <view style="height:10px;width:100%;background-color: #f2f2f2"></view>

    <view class="report-item-box">
      <view class="report-item-label">常用功能检测</view>
      <view class="report-item-des">检测，电子控制系统、功能开关灯光系统等无异常，可正常使用。</view>
      <view style="height:10px;width:100%;"></view>

      <!--电子控制系统-->
      <view class="report-item" @tap="showForm" id="4">
        <view class="report-item-title">电子控制系统</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[3].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom4 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom4 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[3].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--常用功能开关-->
      <view class="report-item" @tap="showForm" id="5">
        <view class="report-item-title">常用功能开关</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[4].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom5 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom5 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[4].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--灯光系统-->
      <view class="report-item" @tap="showForm" id="6">
        <view class="report-item-title">灯光系统</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[5].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom6 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom6 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[5].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--玻璃、后视镜-->
      <view class="report-item" @tap="showForm" id="7">
        <view class="report-item-title">玻璃、后视镜</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[6].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom7 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom7 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[6].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>

      <!--随车附件-->
      <view class="report-item" @tap="showForm" id="8">
        <view class="report-item-title">随车附件</view>
        <view class="report-item-target-box">
          <view class="report-item-target" v-if="detail.reports.content[7].reportTarget === '全部正常'">全部正常</view>
        </view>
        <view class="report-item-check">
          <span :class="isShowFrom8 ? 'tui-shangjiantou' : 'tui-xiajiantou'"></span>
        </view>
      </view>
      <view :class="isShowFrom8 ? ' ' : 'tui-hide '">
        <view class="report-child-box" v-for="(item, index) in detail.reports.content[7].detailContent" :key="index">
          <view class="report-child-title">{{item.title}}</view>
          <view class="report-child-status">
            <icon :type="item.status?'success':'warn'" size="15"></icon>
          </view>
        </view>
      </view>
    </view>

    <view style="height:60px;width:100%;background-color: #f2f2f2"></view>
    <view class="footer-box">
      <view class="footer-button">
        <button open-type="share" class="share-btn">分享给好友</button>
      </view>
      <view class="footer-button">
        <button open-type="contact" class="contact-btn">联系客服</button>
      </view>
    </view>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/report/report';
// pages/report/report.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowFrom1: false,
    isShowFrom2: false,
    isShowFrom3: false,
    isShowFrom4: false,
    isShowFrom5: false,
    isShowFrom6: false,
    isShowFrom7: false,
    isShowFrom8: false,
    isShowFrom9: false,
    reports: {},
    detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   reports: reportData
    // })
    this.setData({
      carid: options.carid
    })
    getReport(this, options.carid)
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
  showForm(e) {
    var param = e.currentTarget.id;
    console.log("param:",param)
    this.setData({
      isShowFrom1: param == 1 ? (!this.data.isShowFrom1) : false,
      isShowFrom2: param == 2 ? (!this.data.isShowFrom2) : false,
      isShowFrom3: param == 3 ? (!this.data.isShowFrom3) : false,
      isShowFrom4: param == 4 ? (!this.data.isShowFrom4) : false,
      isShowFrom5: param == 5 ? (!this.data.isShowFrom5) : false,
      isShowFrom6: param == 6 ? (!this.data.isShowFrom6) : false,
      isShowFrom7: param == 7 ? (!this.data.isShowFrom7) : false,
      isShowFrom8: param == 8 ? (!this.data.isShowFrom8) : false,
      isShowFrom9: param == 9 ? (!this.data.isShowFrom9) : false
    });
  }
})

function getReport(page, carid) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在加载',
  })
  wx.request({
    url: host+'/getreport',
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
export default global['__wxComponents']['pages/report/report'];
</script>
<style>
@import "./report.css";
</style>