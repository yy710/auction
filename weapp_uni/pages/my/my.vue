<template>
  <view>
    <van-divider contentPosition="center" customStyle="color: #1989fa;border-color: #1989fa;font-size: 14px;">已成交车辆</van-divider>

    <van-grid column-num="2" :border="false" square>
      <van-grid-item use-slot v-for="(item, plateNum) in cars" :key="plateNum">
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
import imgBtnCmp from '../../components/image-button/index';
import tagCmp from '../../components/tag/index';
global['__wxVueOptions'] = {
  components: {
    'img-btn-cmp': imgBtnCmp,
    'tag-cmp': tagCmp
  }
};
global['__wxRoute'] = 'pages/my/my';
const { request } = require('../../utils/util');

Page({
  data: {
    hasUserInfo: true,
    userInfo: null,
    cars: []
  },

  onShow: function(options) {
    this.getMycar();
  },

  getMycar() {
    request('/get-mycar', {})
      .then(res => {
        console.log('get-mycar: ', res.data);
        const cars = res.data.content;
        this.setData({ cars });
      })
      .catch(err => console.log(err));
  }
});
export default global['__wxComponents']['pages/my/my'];
</script>
<style>
@import './my.css';
</style>
