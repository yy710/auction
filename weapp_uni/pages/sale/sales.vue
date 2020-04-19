<template>
<view class="container">
	<view class="search-list-container">
		<scroll-view scroll-y="true" style="height: 80%;width:100%">
			<view style="border-top: 1px solid #d1d3d4;" v-for="(item, id) in cars" :key="id" @click="goToDetail" :id="item.id">
				<view class="search-item-container">
					<view class="search-item-image" style="flex:3;">
						<image mode="aspectFill" :src="item.imageURL" style="width: 150px;height:95px"></image>
					</view>
					<view class="search-item-info-box" style="flex:4;">
						<view style="margin-left:10px;width: 100%;height:100%;display:flex;flex-direction:column">
							<view class="search-item-title">{{item.title}}<van-tag mark :color="item.tag.color" size="medium">{{item.tag.msg}}</van-tag>
							</view>
							<view class="search-item-info">{{item.carTime}}<span>|</span>{{item.gongLi}}万公里</view>
							<view class="search-item-price">
								<view class="price">起拍价{{item.price/10000}}万</view>
								<view class="payment">新车价{{item.firstPay}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/sale/sales';
const { request } = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    cars: []
  },

  onLoad: function (options) {
    //getList(this);
  },

  onShow: function(){
    getList(this);
  },
  
  goToDetail: function (e) {
    console.log(e);
    const { userInfo } = e.detail;
    const carid = e.currentTarget.id
    const url = '../detail/detail?carid=' + carid;
    // if getUserInfo error
    if(!userInfo){
      wx.showToast({
        title: '请同意授权用户信息！',
        duration: 2000
      });
      wx.reLaunch({ url });
      return 0;
    }

    app.globalData.userInfo = userInfo;

    // update userinfo to db of server
    request('/update-userinfo', { userInfo }).then(res => {
      var carid = e.currentTarget.id
      const url = '../detail/detail?carid=' + carid;
      //wx.navigateTo({ url });
      //wx.switchTab({ url });
      wx.reLaunch({ url });
    }).catch(err => console.log(err));
  }
});

//--------------------------------------------------------------
function getList(page) {
  wx.showLoading({ title: '正在获取' });
  request('/get-cars', {}).then(res => {
    wx.hideLoading();
    console.log("get-cars: ", res.data);
    const cars = res.data.cars;
    page.setData({ cars });
  }).catch(err => {
      wx.hideLoading();
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  });
}
export default global['__wxComponents']['pages/sale/sales'];
</script>
<style>
@import "./sales.css";
</style>