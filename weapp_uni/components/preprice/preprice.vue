<template>
  <view>
    <van-field
      center
      input-align="right"
      use-button-slot
      left-icon="contact"
      right-icon="/static/wan.png"
      :value="price"
      :placeholder="placeholder"
      type="digit"
      @change="onInput"
      @focus="onFocus"
      :label="prePrice ? '我的预出价: ¥' : '我要预出价: ¥'"
      :error-message="msg"
      maxlength="6"
      title-width="100px"
      :disabled="disableField"
      :focus="getFieldFocus"
    >
      <van-button slot="button" plain hairline size="small" type="primary" @click="onClick" :disabled="disableButton">{{ buttonText }}</van-button>
    </van-field>
  </view>
</template>

<script>
const { request } = require('../../utils/util.js');
const app = getApp();

export default {
  data() {
    return {
      price: '',
      msg: '若最终竞拍价小于预出价时，将以预出价成交',
      placeholder: '',
      buttonText: null,
      disableField: true,
      disableButton: false,
      getFieldFocus: false
    };
  },

  props: {
    startPrice: Number,
    prePrice: String,
    carid: String
  },

  computed: {
    //
  },

  mounted() {
    console.log('component preprice mounted!');
    this.buttonText = this.prePrice ? '修改价格' : '确认价格';
    this.disableField = !!this.prePrice;
    this.placeholder = this.prePrice || this.startPrice;
  },

  methods: {
    onInput(e) {
      //console.log("props: ", this.price);
      this.price = Math.round(parseFloat(e.detail)*100)/100;
      //console.log("this.prePrice: ", this.prePrice);
      this.msg = this.price > this.startPrice ? '最终竞拍价小于此价时，将以此价成交' : '请输入大于起拍价的价格';
      this.disableButton = this.price > this.startPrice ? false : true;
    },

    onClick() {
      if (!app.globalData.user || !app.globalData.user.mobile) {
        uni.showModal({
          title: '提示',
          content: '请先报名参加竞价！',
          showCancel: false,
          success() {
            //
          }
        });
        return 0;
      }

      if (this.buttonText == '修改价格') {
        this.disableField = false;
        this.getFieldFocus = true;
        this.buttonText = '确认价格';
        this.disableButton = true;
      } else if (this.buttonText == '确认价格') {
        this.getFieldFocus = false;
        if (!this.price || this.price <= this.startPrice) {
          uni.showModal({
            title: '提示',
            content: '价格必须大于起拍价！',
            showCancel: false,
            success() {
              //
            }
          });
        } else {
          request('/set-prePrice', { prePrice: this.price*10000, carid: this.carid })
            .then(res => {
              console.log('preprice/onClick: ', res.data);
              const { errcode, msg, user } = res.data;

              if (!res.data.errcode) {
                uni.showToast({ title: msg, duration: 1000 });
                this.buttonText = '修改价格';
                this.disableField = true;
              }
            })
            .catch(err => console.log(err));
        }
      }
    },

    onFocus() {
      this.placeholder = '';
    }
  }
};
</script>

<style></style>
