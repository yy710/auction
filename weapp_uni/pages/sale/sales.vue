<template>
<view class="container">
  <van-divider contentPosition="center">{{ title }}</van-divider>
	<view class="search-list-container">
		<scroll-view scroll-y="true" style="height: 80%;width:100%">
			<view style="border-top: 1px solid #d1d3d4;" v-for="(item, id) in cars" :key="id" @click="goToDetail" :data-id="item.id" :data-tagid="item.tag.id">
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
    title: '感谢关注，当前暂无车辆参加竞价',
    cars: []
  },

  onLoad: function (options) {
    //
  },

  onShow: function(){
    getList(this);
  },
  
  goToDetail: function (e) {
    app.globalData.carid = e.currentTarget.dataset.id;
    const url = '../detail/detail?carid=' + e.currentTarget.dataset.id ;
    const tagid = e.currentTarget.dataset.tagid;
    //wx.navigateTo({ url });
    //wx.switchTab({ url });
    if(tagid == 2 )return 0;
    wx.reLaunch({ url });
  }
});

//--------------------------------------------------------------
function getList(page) {
  wx.showLoading({ title: '正在获取' });
  request('/get-cars', {}).then(res => {
    wx.hideLoading();
    console.log("get-cars: ", res.data);
    const cars = res.data.cars;
    const title = cars.length ? '当前参加竞价车辆列表' : '感谢关注，当前暂无车辆参加竞价';
    page.setData({ cars, title });
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