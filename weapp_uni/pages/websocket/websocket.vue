<template>
  <view>
    <view>webSocket发出的消息：{{ sendMsg }}</view>
    <view>webSocket收到的消息：{{ receviedMsg }}</view>
    <button @click="onClickButton">sendMsg</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      receviedMsg: null,
      sendMsg: null
    };
  },

  methods: {
    onClickButton(e) {
      const that = this;
      const data = JSON.stringify({ action: 'hello' });
      this.socketTask.send({
        data,
        success: function() {
          that.sendMsg = data;
        }
      });
    }
  },

  onLoad(option) {
    const that = this;
    this.socketTask = uni.connectSocket({
      url: 'wss://www.all2key.cn/yz',
      //header: { 'content-type': 'appliction/json', client: 'weapp', token: sid, apptoken: 'yz_auction' },
      complete() {}
    });

    this.socketTask.onOpen(function(msg) {
      console.log('onOpen: ', msg);
      //that.receviedMsg = "open!";
    });

    this.socketTask.onClose(function() {
      console.log('socketTask closed!');
    });

    this.socketTask.onMessage(function(res) {
      const msg = JSON.parse(res.data);
      that.receviedMsg = msg.time;
      console.log('recevied msg: ', msg);
    });
  }
};
</script>

<style></style>
