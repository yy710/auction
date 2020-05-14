<template>
  <view>
    <!-- <van-divider contentPosition="center" v-if="isBuyer">您的出价为当前最高价! </van-divider> -->
    <van-notice-bar v-if="isBuyer" scrollable="false" text="您的出价为当前最高价!" color="red" left-icon="volume" />
    <van-count-down use-slot ref="countDown" v-if="show[0]" :time="time" :auto-start="true" @finish="finished" @change="onTimeChange">
      <view style="padding-left:10px">
        <text>距离竞价结束还剩余</text>
        <text class="item">{{ timeData.hours }}</text>
        <text>时</text>
        <text class="item">{{ timeData.minutes }}</text>
        <text>分</text>
        <text class="item">{{ timeData.seconds }}</text>
        <text>秒</text>
      </view>
    </van-count-down>

    <!-- <van-grid clickable>
      <van-grid-item text="开始" icon="play-circle-o" @click="start" />
      <van-grid-item text="暂停" icon="pause-circle-o" @click="pause" />
      <van-grid-item text="重置" icon="replay" @click="reset" />
      <van-grid-item text="更新" icon="update" @click="updateTime" />
    </van-grid> -->

    <van-count-down use-slot @change="onTimeChange" ref="countDown2" v-if="show[1]" :time="time3" :auto-start="true" @finish="finished2">
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
    </van-count-down>

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
import socket from 'plus-websocket'
// #ifdef APP-PLUS
Object.assign(uni, socket)
// #endif
import yGetphone from '../get-phone/index';
global['__wxVueOptions'] = { components: { 'y-getphone': yGetphone } };
global['__wxRoute'] = 'components/auction/auction';
const app = getApp();
const sid = wx.getStorageSync('sid');

Component({
  properties: {
    carid: {
      type: String,
      value: null,
      observer(newValue, oldValue) {
        console.log('component/auction/carid/newValue: %s, oldValue: %s', newValue, oldValue);
        this.sayHello();
      }
    },
    time2: {
      type: Number,
      value: 0,
      observer(newValue, oldValue) {
        console.log('component/auction/time2/newValue: %s, oldValue: %s', newValue, oldValue);
        const time3 = newValue - new Date().getTime();
        console.log('change time: ', time3);
        if (time3 > 0) {
          this.setData({ show: [0, 1], time3 });
        } else {
          this.setData({ show: [1, 0], time3 });
          // get data from by websocket
          this.sayHello();
        }
      }
    }
  },

  data: {
    timeData: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    show: [0, 0],
    price: 0,
    socketMsg: '',
    time: 2 * 60 * 1000,
    time3: 20 * 60 * 1000,
    state: 'ready', // ready | go | stop
    lastCarid: null, // store carid from webSocket for next action
    disableAdd: false,
    isBuyer: false
  },

  lifetimes: {
    created() {
      console.log('components auction created!');
      //this.socketTask = socketConnect(this);
    },

    attached() {
      console.log('components/auction attached!');
      socketConnect(this);
      //this.sayHello();
    },

    detached() {
      console.log('components/auction detached!');
      this.socketTask.close();
    }
  },

  methods: {
    // test() {
    //   console.log('refs test!');
    // },
    
    // reconnectSocket(){
    //   console.log('socketTask reconnected!');
    //   socketConnect(this);
    // },

    // for render countDown
    onTimeChange(e) {
      this.setData({ timeData: e.detail });
    },

    sayHello() {
      //console.log('auction.sayHello()');
      const data = JSON.stringify({ action: 'hello' });
      this.socketTask.send({ data, success: () => console.log('socket send data: ', data) });
    },

    // countDown methods -------------------------------------------------------
    start() {
      // weapp
      //const countDown = this.selectComponent('.control-count-down');

      // vue
      //console.log('this.$refs: ', this.$refs);
      this.$refs.countDown.start();
    },

    pause() {
      this.$refs.countDown.pause();
    },

    reset() {
      this.$refs.countDown.reset();
    },
    //----------------------------------------------------------------------------

    // test changeCar event
    updateTime() {
      this.setData({ time: 180000 });
      this.triggerEvent('changeCar', { carid: '云A961JT' });
    },

    finished() {
      wx.showToast({ title: '竞价结束', icon: 'success', duration: 2000 });
      this.setData({ disableAdd: true, show: [0, 0] });
    },

    finished2() {
      this.setData({ show: [1, 0] });
    },

    addPrice(e) {
      const that = this;
      console.log('addPrice: ', e);
      wx.showModal({
        title: '提示',
        content: '出价后20秒内无人加价即可成交，确认出价？',
        success: res => {
          if (res.confirm) {
            const data = JSON.stringify({
              action: 'addPrice',
              carid: that.carid,
              price: that.price,
              addNum: e.target.dataset.num,
              user: sid
            });
            //if (that.disableAdd) return 0;
            that.socketTask.send({
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

function socketConnect(page) {
  const socketTask = uni.connectSocket({
    url: 'wss://www.all2key.cn/yz',
    header: { 'content-type': 'appliction/json', client: 'weapp', token: sid, apptoken: 'yz_auction' },
    complete() {}
  });

  // register event handle for socketTask
  socketTask.onOpen(res => {
    console.log('socket open: ', res);
    // sent auth info to server
  });

  socketTask.onMessage(res => {
    console.log('recive message: ', res);

    if (!res.data) return 0;
    const data = JSON.parse(res.data);
    const price = parseInt(data.price);
    const time = parseInt(data.time);

    if (!data.carid) {
      // no auctioning
      socketTask.close();
      console.log('no auctioning! websocket closed!');
    } else if (data.carid !== page.properties.carid) {
      // user is browsing car
      if (!page.lastCarid) {
        wx.showModal({
          title: '当前正在竞价',
          content: '是否切换到竞价页面？',
          success: res => {
            if (res.confirm) {
              page.triggerEvent('changeCar', { carid: data.carid });
            } else if (res.cancel) {
              console.log('用户点击取消');
              page.time3 < 0 && page.setData({ show: [0, 1], time3: time });
            }
          }
        });
      } else {
        // next car auction
        page.triggerEvent('changeCar', { carid: data.carid });
      }
    } else {
      page.setData({
        show: [1, 0],
        price,
        time,
        state: data.state,
        lastCarid: data.carid,
        disableAdd: data.time < 0,
        isBuyer: uni.getStorageSync('sid') === data.sid
      });
      // change price of parent component
      page.triggerEvent('changePrice', { price, reachReserve: data.price >= data.reserve });
      page.$refs.countDown && page.$refs.countDown.reset();
      //page.$refs.countDown.start();
    }
  });

  socketTask.onClose(e => {
    console.log('socket close: ', e);
    if(page.isBuyer){
      uni.showModal({
        title: '恭喜你',
        content: `以¥${page.price}元拍得此车，随后我们的工作人员会与您联系办理相关提车手续，点击右下角“我的车”可查看具体信息。`,
        showCancel: false,
        success: () => {
          //
        }
      });
    }
  });

  page.socketTask = socketTask;
  return socketTask;
}

export default global['__wxComponents']['components/auction/auction'];
</script>

<style>
@import './auction.css';
</style>
