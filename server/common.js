const assert = require('assert');
const schedule = require('node-schedule');
const EventEmitter = require('events');

/**
 * @class
 * @extends EventEmitter
 */
class CountDown extends EventEmitter {
  /**
   * @constructor
   * @param {number} time unit: seconds
   */
  constructor(time = 0) {
    super();
    this.endTime = 0;
    this.timer = null;
    //this.start(time);
  }

  /**
   * @return {number} left milleseconds
   */
  get() {
    const time = this.endTime - new Date().getTime();
    return time < 0 ? 0 : time;
  }

  start(time) {
    this.endTime = new Date().getTime() + time * 1000;
    this.timer = setTimeout(() => this.emit('timeout', time), time * 1000);
    return this;
  }

  reset(time = 20) {
    if (this.timer) clearTimeout(this.timer);
    this.start(time);
    return this;
  }
}

class Task {
  constructor(wsss, data) {
    // data: {
    //   app_token = 'yz'; // multi products
    //   id = 0;
    //   state = 0; // 0: no ready, 1: ready, 2: doing, 3: end
    //   start_time = new date(); // 竞价场次开始时间
    //   auctions = []; // 排队竞价的产品列表
    // }
    this.data = data;
    this.logger = new Logger('auction');
    this.wss = wsss.get(data.app_token);
    this.data.state = 1;
    this.countDown = new CountDown();
    // currentauction: {
    //   state  0: ready, 1: go, 2: end, 3: 流拍
    //   price  起拍价
    //   reserve  保留价
    //   carid 产品id
    //   winnerid 最终胜者id
    //   logs 竞价过程记录
    // }
    this.currentAuction = null;
    this.job = this.createJob();
    //this.initWss();
    //this.initCountDown();
  }

  initCountDown() {
    this.countDown.on('timeout', time => {
      // [debug]
      console.log('timeout: ', time);
      this.currentAuction.state = 2; // auction end
      // save this.currentAuction to db

      this.nextAuction();
    });
  }

  broadcast(data = this.getCurrent()) {
    // [debug]
    console.log('broadcast: ', data);
    //{
    //  price: this.auc.price,
    //  time: this.countDown.get(),
    //  state: this.auc.state,
    //  carid: this.auc.carid
    //}
    this.wss.clients.forEach(client => {
      // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }

  initWss() {
    this.wss.removeAllListeners('connection');
    this.wss.on('connection', wssCb(this));
  }

  createJob(f = null) {
    let startTime = this.data.start_time;
    if (typeof startTime == 'string') startTime = parseInt(this.data.start_time);
    return schedule.scheduleJob(startTime, this.getExec(f));
  }

  getExec(f = null) {
    if (typeof f == 'function') this.exec = f;
    return date => this.exec(date);
  }

  exec(date) {
    // debug
    console.log('job start at ', date);
    //console.log('task.data.auctions: ', this.data.auctions);

    this.initWss();
    this.initCountDown();
    this.data.state = 2; // task start, 2: doing
    this.nextAuction();
  }

  handleConnection(socket, req) {
    // [debug]
    console.log('client ip: ', req.connection.remoteAddress);
    console.log('client token: ', req.headers.token);
    console.log('app token: ', req.headers.apptoken);

    this.sayHellow(socket);

    socket.on('message', _msg => {
      try {
        // [debug]
        console.log('Received message: ', _msg);
        const msg = JSON.parse(_msg);
        // save to logs
        //this.logger.save('receiveMsg', msg);
        if (msg.action === 'addPrice') {
          this.addPrice(msg);
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('close', function() {
      console.log('websocket connection closed');
    });
  }

  sayHellow(socket) {
    if (!this.currentAuction) {
      socket.close();
    } else {
      const data = this.getCurrent();
      console.log('sayHellow data: ', data);
      socket.send(JSON.stringify(data));
    }
    return this;
  }

  nextAuction() {
    // [debug]
    console.log(
      'last auction carid: ',
      this.currentAuction && this.currentAuction.car && this.currentAuction.car.plateNum
    );

    this.currentAuction = this.data.auctions.shift();
    if (!this.currentAuction) {
      // [debug]
      console.log('task ', this.data.id, 'completed!');

      this.closeAllSocket();
      //this.wss.removeAllListeners('connection');
    } else {
      // [debug]
      console.log('next auction carid: ', this.currentAuction.car.plateNum);

      this.currentAuction.state = 1; // 1: go
      this.countDown.reset( 2 * 60);
    }
    this.broadcast();
    return this;
  }

  closeAllSocket() {
    this.wss.clients.forEach(client => {
      // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
      if (client.readyState === 1) {
        client.close();
      }
    });
  }

  getCurrent() {
    try {
      if (!this.currentAuction) return {};
      const { state, price, reserve } = this.currentAuction;
      const carid = this.currentAuction.car.plateNum;
      return { state, price, reserve, carid, time: this.countDown.get() };
    } catch (error) {
      console.log('getCurrent(): ', error);
    }
  }

  async addPrice(msg) {
    console.log('addPrice() msg: ', msg);
    if (!this.currentAuction) return this;

    if (msg.carid !== this.currentAuction.car.plateNum) {
      console.log('addPrice: carid error!');
      return this;
    }

    const user = await getUser(msg.user);
    if (!user) {
      console.log('addPrice: sid error!');
      return this;
    }

    if (typeof this.currentAuction.price == 'string') this.currentAuction.price = parseInt(this.currentAuction.price);
    this.currentAuction.price += parseInt(msg.addNum);
    if (this.currentAuction.price >= this.currentAuction.reserve) {
      // start 20s 计时器
      this.countDown.reset(20);
    }
    this.broadcast();
    // save to logs
    this.logger.save('addPrice', msg);
    return this;
  }
}

class Logger {
  constructor(tag, col = global.db.collection('logs')) {
    this.tag = tag;
    this.col = col;
  }

  save(action, data) {
    this.col.insertOne({ tag: this.tag, date: new Date(), action, data });
    return this;
  }

  find() {}
}

//---------------------------------------------------------------

function wssCb(obj) {
  assert.equal('function', typeof obj.handleConnection);
  return function(socket, req) {
    obj.handleConnection(socket, req);
  };
}

function mergeOptions(options, defaults) {
  for (var key in defaults) {
    options[key] = options[key] || defaults[key];
  }
  return options;
}

function getUser(sid) {
  const col = global.db.collection('sessions');
  return col.findOne({ sid });
}

module.exports = { Task, CountDown };
