//const app = getApp();
let socketTask = null;
let price = 0;

Component({
  properties: {

  },

  data: {
    price: '等待连接。。。',
    socketMsg: '',
    time: 200000,
    timeDate: {},
    state: 'ready', // ready | go | stop
    disableAdd: false
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },

  // 自小程序基础库版本 2.2.3 起，组件的的生命周期也可以在 lifetimes 字段内进行声明
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      socketTask = wx.connectSocket({
        url: 'wss://www.all2key.cn',
        header: {
          'content-type': 'appliction/json',
          'client': 100,
          'token': 'yy710',
          'apptoken': 'yz'
        }
      });

      socketTask.onOpen(res => {
        console.log(res);
        this.setData({
          price: '连接成功！'
        });
      });

      socketTask.onMessage(res => {
        console.log("recive: ", res);
        const data = JSON.parse(res.data);
        price = data.price;
        this.setData({
          price: data.price,
          time: data.time,
          state: data.state,
          carid: data.carid,
          disableAdd: data.time < 0
        });
        this.triggerEvent("changePrice", {
          price: data.price,
          reachReserve: data.price >= data.reserve
        });
        this.reset();
        this.start();
      });
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  methods: {
    onTimeChange(e) {
      this.setData({
        timeData: e.detail
      });
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
      wx.showToast({
        title: '竞价结束',
        icon: 'success',
        duration: 2000
      });
      this.setData({
        disableAdd: true
      });
    },

    add200: _add(200),

    add500: _add(500),

    add1000: _add(10000),
  }
});

function _add(n) {
  return e => {
    //console.log("e: ", e);
    const data = JSON.stringify({
      price,
      add: n,
      user: "yy710"
    });
    //if (this.data.disableAdd) return 0;
    socketTask.send({
      data,
      success: function() {
        console.log("socket send data: ", data);
      }
    });
  };
}