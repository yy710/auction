<template>
  <view>
    <van-button plain type="primary" @tap="onShowPopup" v-if="showEnroll">竞价报名</van-button>
    <van-popup :show="showPopup" @close="onPopupClose" custom-style="height: 200px;width: 90%">
      <van-cell-group title="请填写信息">
        <van-field :value="mobile" type="digit" maxlength="20" label="手机号：" @change="onChangeMobile" placeholder="请如实填写" :error-message="errMobile"></van-field>
        <van-field :value="nickName" maxlength="10" label="姓 名：" @change="onChangeNickName" placeholder=""></van-field>
        <button size="normal" type="primary" @tap="commitInfo">报名参加竞价</button>
      </van-cell-group>
    </van-popup>
  </view>
</template>

<script>
global['__wxRoute'] = 'components/get-phone/index';
const { request, validMobile } = require('../../utils/util');

Component({
  properties: {},

  data: {
    showPopup: false,
    showEnroll: true,
    nickName: '',
    errMobile: '',
    mobile: null
  },

  lifetimes: {
    attached() {
      request('/get-userphone', {})
        .then(res => {
          console.log('get-userphone: ', res.data);
          const mobile = res.data.content;
          this.setData({ mobile, showEnroll: !mobile });
        })
        .catch(err => console.log('get-userphone err: ', err));
    }
  },

  methods: {
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

    onShowPopup() {
      this.setData({ showPopup: true });
    },

    onPopupClose() {
      this.setData({ showPopup: false });
    },

    async commitInfo() {
      if (this.errMobile || !this.mobile) return 0;
      const data = { nickName: this.nickName, mobile: this.mobile };
      const res = (await request('/enroll', data)).data;
      // console.log('enroll res.data: ', res);
      if (res.code) {
        this.onPopupClose();
        uni.showToast({
          title: '报名成功！'
        });
        this.setData({ showEnroll: false });
      } else {
        this.onPopupClose();
        uni.showToast({
          title: '报名失败，请稍后再试！'
        });
      }
    }
  }
});

export default global['__wxComponents']['components/get-phone/index'];
</script>
<style>
@import './index.css';
</style>
