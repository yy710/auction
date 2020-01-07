//const app = getApp();
let socketTask = null;

Component({
  properties: {

  },

  data: {
    socketText: '等待连接。。。',
    socketMsg: '',
    time: 200000,
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
          'client': 100
        }
      });

      socketTask.onOpen(res => {
        console.log(res);
        this.setData({
          socketText: '连接成功！'
        });
      });

      socketTask.onMessage(res => {
        //console.log("recive: ", res);
        const data = JSON.parse(res.data);
        this.setData({
          socketText: data.price,
          time: data.time,
          state: data.state
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
        title: '倒计时结束',
        icon: 'success',
        duration: 2000
      });
      this.setData({
        disableAdd: true
      });
    },

    add() {
      socketTask.send({
        data: JSON.stringify({
          price: 1000
        }),
        success: function() {
          console.log("socket send data ok!");
        }
      });
    }
  }
});