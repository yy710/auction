<template>
<view>
  <van-steps direction="vertical" :steps="steps" :active="active"></van-steps>
</view>
</template>


<script>
global['__wxRoute'] = 'pages/history/history';
const { request } = require('../../utils/util.js');

Page({
  data: {
    steps: [],
    active: 0
  },

  onLoad: function (options) {
    console.log("options: ", options);
    const { carid } = options;
    request('/get-history', { carid })
    .then(res => {
      console.log("get-history: ", res.data);
      const steps = res.data.content;
      this.setData({ steps, active: steps.length - 1 });
    })
    .catch(err => console.log(err));
  }
})
export default global['__wxComponents']['pages/history/history'];
</script>
<style>
@import "./history.css";
</style>