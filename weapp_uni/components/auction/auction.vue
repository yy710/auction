<template>
  <view>
    <y-countdown ref="countDown" v-if="true" :time="time" :auto-start="true" @finish="finished">
      <template v-slot="timeData">
        <view style="padding-left:10px">
          <text>距离竞价结束还剩余</text>
          <text class="item">{{ timeData.hours }}</text>
          <text>时</text>
          <text class="item">{{ timeData.minutes }}</text>
          <text>分</text>
          <text class="item">{{ timeData.seconds }}</text>
          <text>秒</text>
        </view>
      </template>
    </y-countdown>

    <van-grid clickable>
      <van-grid-item text="开始" icon="play-circle-o" @click="start" />
      <van-grid-item text="暂停" icon="pause-circle-o" @click="pause" />
      <van-grid-item text="重置" icon="replay" @click="reset" />
      <van-grid-item text="更新" icon="update" @click="updateTime" />
    </van-grid>

    <y-countdown ref="countDown2" v-if="show[1]" :time="time3" :auto-start="true">
      <template v-slot="timeData">
        <view style="padding-left:10px">
          <text>距离竞价开始还剩余</text>
          <text class="item2">{{ timeData.days }}</text>
          <text>天</text>
          <text class="item2">{{ timeData.hours }}</text>
          <text>时</text>
          <text class="item2">{{ timeData.minutes }}</text>
          <text>分</text>
          <text class="item2">{{ timeData.seconds }}</text>
          <text>秒</text>
        </view>
      </template>
    </y-countdown>

    <y-getphone></y-getphone>

    <van-grid clickable column-num="3" v-if="show[0]">
      <van-grid-item @click="addPrice" data-num="200">
        <view slot="text">
          加价
          <text style="font-size:20pxcolor:red">¥200</text>
          元
        </view>
      </van-grid-item>
      <van-grid-item @click="addPrice" data-num="500">
        <view slot="text">
          加价
          <text style="font-size:20pxcolor:red">¥500</text>
          元
        </view>
      </van-grid-item>
      <van-grid-item @click="addPrice" data-num="1000">
        <view slot="text">
          加价
          <text style="font-size:20pxcolor:red">¥1000</text>
          元
        </view>
      </van-grid-item>
    </van-grid>
  </view>
</template>

<script>
import yGetphone from '../get-phone/index';
import { CountDown } from 'vant';
global['__wxVueOptions'] = { components: { 'y-getphone': yGetphone, 'y-countdown': CountDown } };
global['__wxRoute'] = 'components/auction/auction';
const app = getApp();
const sid = wx.getStorageSync('sid');
let socketTask = null;

Component({
  properties: {
    carid: String,
    time2: {
      type: Number,
      value: 0,
      observer(newValue, oldValue) {
        const time3 = newValue - new Date().getTime();
        console.log('time: ', time3);
        if (time3 > 0) {
          this.setData({ time3, show: [0, 1] });
          //this.$refs.countDown2.reset();
        }
      }
    }
  },

  data: {
    timeDate: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    show: [0, 0],
    price: 0,
    socketMsg: '',
    time: 20000,
    time3: 120000,
    state: 'ready', // ready | go | stop
    _carid: null,
    disableAdd: false
  },

  // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明
  lifetimes: {
    created: function() {
      socketTask = wx.connectSocket({
        url: 'wss://www.all2key.cn/yz',
        header: { 'content-type': 'appliction/json', client: 'weapp', token: sid, apptoken: 'yz_auction' },
        complete() {}
      });
    },

    // 在组件实例进入页面节点树时执行
    attached: function() {
      const _this = this;
      socketTask.onOpen(res => {
        console.log('socket open: ', res);
        // sent auth info to server
        
      });

      socketTask.onMessage(res => {
        console.log('recive message: ', res);

        if (!res.data) return 0;
        const data = JSON.parse(res.data);
        const price = parseInt(data.price);

        if (!data.carid) {
          // no auctioning
          socketTask.close();
          console.log('no auctioning! websocket closed!');
          return 0;
        } else if (!this.properties.carid) {
          // click auction button
          this.triggerEvent('changeCar', { carid: data.carid });
        } else if (this.properties.carid !== data.carid) {
          // user is browsing car
          if (!this.data._carid) {
            wx.showModal({
              title: '当前正在竞价',
              content: '是否切换到竞价页面？',
              success: res => {
                if (res.confirm) {
                  this.triggerEvent('changeCar', { carid: data.carid });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          } else {
            // next car auction
            this.triggerEvent('changeCar', { carid: data.carid });
          }
          // because use is browing, no start next auction
          return 1;
        }

        this.setData({
          show: [1, 0],
          price,
          time: parseInt(data.time),
          state: data.state,
          _carid: data.carid,
          disableAdd: data.time < 0
        });
        this.triggerEvent('changePrice', { price, reachReserve: data.price >= data.reserve });
        //_this.reset();
        //_this.start();
      });

      socketTask.onClose(e => {
        console.log('socket close: ', e);
      });
    },

    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log('component detached!');
      socketTask.close();
    },

    beforeDestroy() {
      console.log('component hide!');
      socketTask.close();
    }
  },

  methods: {
    start() {
      // weapp
      //const countDown = this.selectComponent('.control-count-down');
      this.$refs.countDown.start();
    },

    pause() {
      //const countDown = this.selectComponent('.control-count-down');
      this.$refs.countDown.pause();
    },

    reset() {
      //const countDown = this.selectComponent('.control-count-down');
      this.$refs.countDown.reset();
    },
    
    updateTime(){
      this.setData({ time: 180000 });
    },

    finished() {
      wx.showToast({ title: '竞价结束', icon: 'success', duration: 2000 });
      this.setData({ disableAdd: true, show: [0, 0] });
    },

    addPrice(e) {
      console.log('addPrice: ', e);
      wx.showModal({
        title: '提示',
        content: '出价后20秒内无人加价即可成交，确认出价？',
        success: res => {
          if (res.confirm) {
            const data = JSON.stringify({
              action: 'addPrice',
              carid: this.data.carid,
              price: this.data.price,
              addNum: e.target.dataset.num,
              user: sid
            });
            //if (this.data.disableAdd) return 0;
            socketTask.send({
              data,
              success: function() {
                console.log('socket send data: ', data);
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  }
});
export default global['__wxComponents']['components/auction/auction'];
</script>

<style>
@import './auction.css';
</style>
