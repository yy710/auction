const app = getApp();
const sid = wx.getStorageSync('sid');
let socketTask = null;

Component({
  properties: {
    carid: String,
    time2: {
      type: Number,
      value: 0,
      observer(newValue, oldValue){
        const time3 = newValue - (new Date().getTime());
        //console.log('time3: ', time3);
        if(time3 > 0)this.setData({ time3, show: [0, 1] });
      }
    }
  },

  data: {
    show: [0, 0],
    price: 0,
    socketMsg: '',
    time: 200000,
    tim3: 0,
    timeDate: {},
    state: 'ready', // ready | go | stop
    _carid: null,
    disableAdd: false
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
      console.log("parent page be hide!");
      //socketTask.close().catch(err => console.log(err));
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },

  // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明
  lifetimes: {
    created: function(){
      socketTask =  wx.connectSocket({
        url: 'wss://www.all2key.cn/yz',
        header: {
          'content-type': 'appliction/json',
          'client': 'weapp',
          'token': sid,
          'apptoken': 'yz_auction'
        }
      });
    },

     // 在组件实例进入页面节点树时执行
    attached: function() {
      socketTask.onOpen(res => {
        console.log("socket open: ", res);
      });

      socketTask.onMessage(res => {
        console.log("recive message: ", res);

        if(!res.data)return 0;
        const data = JSON.parse(res.data);
        const price = parseInt(data.price);

        if (!data.carid) {
          // no auctioning
          socketTask.close();
          console.log("no auctioning! websocket closed!");
          return 0;
        } else if (!this.properties.carid){
          // click auction button
          this.triggerEvent("changeCar", { carid: data.carid });
        } else if (this.properties.carid !== data.carid){
          // user is browsing car
          if (!this.data._carid){
            wx.showModal({
              title: '当前正在竞价',
              content: '是否切换到竞价页面？',
              success: res => {
                if (res.confirm) {
                  this.triggerEvent("changeCar", { carid: data.carid });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          }else{
            // next car auction
            this.triggerEvent("changeCar", { carid: data.carid });
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
        this.triggerEvent("changePrice", { price, reachReserve: data.price >= data.reserve });
        this.reset();
        this.start();
      });

      socketTask.onClose(e => {
        console.log("socket close: ", e);
      });
    },

    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log("component detached!");
      socketTask.close().catch(err => console.log(err));
    }
  },

  methods: {
    onTimeChange(e) {
      this.setData({ timeData: e.detail });
    },

    start() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.start();
    },

    pause() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.pause();
    },

    reset() {
      const countDown = this.selectComponent('.control-count-down');
      countDown.reset();
    },

    finished() { 
      wx.showToast({ title: '竞价结束', icon: 'success', duration: 2000 });
      this.setData({ disableAdd: true, show: [0, 0] });
    },

    addPrice(e){
      console.log("addPrice: ", e);
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
              success: function () {
                console.log("socket send data: ", data);
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