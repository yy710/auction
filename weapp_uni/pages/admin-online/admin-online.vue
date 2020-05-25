<template>
  <view>
    <van-divider contentPosition="center" v-if="!isAdmin">无管理权限！</van-divider>
    <view v-if="isAdmin">
      <!-- <van-divider contentPosition="center">{{ onlineText }}</van-divider>
      <van-row v-for="u in onlineUsers" :key="u.sid">
        <van-col span="6">昵称: {{ u.nickName }}</van-col>
        <van-col span="6">手机: {{ u.mobile }}</van-col>
        <van-col span="12">注册时间: {{ u.time }}</van-col>
      </van-row> -->
      
      <van-cell-group :title="onlineText">
        <van-cell v-for="u in onlineUsers" :key="u.sid" icon="phone-o" :title="u.mobile"  title-width="400rpx" :value="u.nickName" :label="'注册时间: ' + u.time" />
      </van-cell-group>
    </view>
  </view>
</template>

<script>
const { request, auth, formatTime } = require('@/utils/util.js');
export default {
  data() {
    return {
      isAdmin: false,
      onlineUsers: []
    };
  },
  methods: {},
  computed: {
    onlineText(){
      return "当前在线人数：" + this.onlineUsers.length;
    }
  },
  onLoad() {
    auth(this)
      .then(res => {
        // console.log(res);
        if(res)return request('/get-online-users', {});
        return Promise.reject('auth fail!');
      })
      .then(res => {
        console.log(res.data);
        const onlineUsers = res.data.content.map(u => {
          u.time = formatTime(new Date(u.time));
          return u;
        });
        this.setData({ onlineUsers });
      })
      .catch(err => console.log(err));
  }
};
</script>

<style></style>
