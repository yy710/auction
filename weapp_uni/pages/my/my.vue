<template>
  <view>
     <van-cell-group title="我的个人信息">
      <van-field :value="mobile" type="digit" maxlength="20" label="手机号：" @change="onChangeMobile" placeholder="请如实填写" :error-message="errMobile"></van-field>
      <van-field :value="nickName" maxlength="10" label="姓 名：" @change="onChangeNickName" placeholder=""></van-field>
      <button size="normal" type="primary" @tap="commitInfo">修改信息</button>
    </van-cell-group>
    
    <van-divider contentPosition="center" customStyle="color: #1989fa;border-color: #1989fa;font-size: 14px;">已成交车辆</van-divider>
    <van-grid column-num="2" :border="false" square>
      <van-grid-item use-slot v-for="(item, index) in cars" :key="item.plateNum"  :data-id="item.plateNum" @click="goToDetail">
        <image mode="aspectFill" style="width: 300rpx;margin-bottom: 5px;padding: 0px" :src="item.imageURL"></image>
        <view>
          <text class="search-item-title">{{ item.title }}</text>
          <text class="price">成交价{{ item.price / 10000 }}万</text>
        </view>
      </van-grid-item>
    </van-grid>
  </view>
</template>

<script>
const app = getApp();
import imgBtnCmp from '../../components/image-button/index';
import tagCmp from '../../components/tag/index';
global['__wxVueOptions'] = {
  components: {
    'img-btn-cmp': imgBtnCmp,
    'tag-cmp': tagCmp
  }
};
global['__wxRoute'] = 'pages/my/my';
const { request, validMobile } = require('../../utils/util');

Page({
  data: {
    nickName: '',
    mobile: '',
    errMobile: '',
    cars: []
  },

  onLoad: function(options) {
    this.getMycar();
  },
  
  onChangeMobile(e) {
    // console.log('onChangeMobile: ', e.detail);
    const mobile = e.detail;
    const errMobile = validMobile(mobile);
    this.setData({ mobile, errMobile });
  },
  
  onChangeNickName(e) {
    // console.log('onChangeNickName: ', e.detail);
    const nickName = e.detail;
    this.setData({ nickName });
  },
  
  goToDetail: function (e) {
    app.globalData.carid = e.currentTarget.dataset.id;
    app.globalData.review = true;
    const url = '../detail/detail?carid=' + e.currentTarget.dataset.id ;
    //wx.navigateTo({ url });
    //wx.switchTab({ url });
    uni.reLaunch({ url });
  },

  async commitInfo() {
    if (this.errMobile || !this.mobile) return 0;
    const data = { nickName: this.nickName, mobile: this.mobile };
    const res = (await request('/enroll', data)).data;
    // console.log('enroll res.data: ', res);
    if (res.code) {
      uni.showToast({
        title: '修改信息成功！'
      });
      this.setData({ showEnroll: false });
    } else {
      uni.showToast({
        title: '修改信息失败，请稍后再试！'
      });
    }
  },

  getMycar() {
    request('/get-mycar', {})
      .then(res => {
        console.log('get-mycar: ', res.data);
        const { user, cars } = res.data.content;
        this.setData({ cars, nickName: user.userInfo.nickName, mobile: user.mobile });
      })
      .catch(err => console.log(err));
  }
});
export default global['__wxComponents']['pages/my/my'];
</script>
<style>
@import './my.css';
</style>
