<template>
  <view>
     <van-divider contentPosition="center" v-if="!isAdmin">无管理权限！</van-divider>
     <view v-if="isAdmin">
       <van-divider contentPosition="center">单击可查看竞价历史</van-divider>
       <view v-for="(item, plateNum) in auctions" :key="plateNum" @tap="toHistory" :data-id="item.plateNum">
         <van-card :thumb="item.thumb" :tag="item.tag">
           <!-- <text slot="num">保留价：{{ item.reservePrice }}</text> -->
           <view slot="desc">
             <van-row>
               <van-col span="6">车牌号：</van-col>
               <van-col span="18">{{ item.plateNum }}</van-col>
             </van-row>
             <van-row>
               <van-col span="6">买&nbsp;&nbsp;&nbsp;家：</van-col>
               <van-col span="18">
                 <van-icon :name="item.buyer.avatarUrl" size="20px"></van-icon>
                 {{ item.buyer.nickName }}--{{ item.buyer.mobile }}
               </van-col>
             </van-row>
             <van-row>
               <van-col span="6">成交价：</van-col>
               <van-col span="18">¥{{ item.buyer.price/10000 }}万</van-col>
             </van-row>
           </view>
         </van-card>
       </view>
     </view>
  </view>
</template>

<script>
global['__wxRoute'] = 'pages/stage/stage';
const { request, auth } = require('../../utils/util.js');

Page({
  data: {
    isAdmin: false,
    auctions: []
  },

  toHistory(e) {
    console.log('toHistory: ', e);
    const carid = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/history/history?carid=' + carid });
  },
  
  onLoad() {
    auth(this).catch(err => console.log(err));
  },

  onShow: function() {
    request('/get-auctions', {})
      .then(res => {
        console.log('get-auctions: ', res.data);

        const _auctions = res.data.content;

        const auctions = _auctions.map(auc => {
          console.log('auc: ', auc);
          if (!auc.buyer) {
            auc.buyer = { avatarUrl: 'manager', nickName: '', mobile: '' };
          }
          if (!auc.buyer.avatarUrl) {
            auc.buyer.avatarUrl = 'manager';
          }
          auc.buyer.nickName = auc.buyer.userInfo && auc.buyer.userInfo.nickName;
          return auc;
        });

        this.setData({ auctions });
      })
      .catch(err => console.log(err));
  }
});
export default global['__wxComponents']['pages/stage/stage'];
</script>
<style>
@import './stage.css';
</style>
