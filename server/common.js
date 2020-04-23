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
    this.updateState(1);
    this.countDown = new CountDown();
    // currentauction: {
    //   state  0: ready, 1: go, 2: sold, 3: 流拍
    //   price  起拍价
    //   reserve  保留价
    //   carid 产品id
    //   winnerid 最终胜者id
    //   logs 竞价过程记录
    // }
    global.currentAuction = null;
    this.job = this.createJob();
    //this.initWss();
    //this.initCountDown();
  }

  updateState(state) {
    this.data.state = state;
    return updateStageState(this.data.id, state);
  }

  initCountDown() {
    this.countDown.on('timeout', (time) => {
      global.debug && console.log('timeout: ', time);
      // set auction end flag
      global.currentAuction.state = 2;
      // save this.currentAuction to db
      global.db
        .collection('logs')
        .find({ action: 'addPrice', 'data.carid': global.currentAuction.car.plateNum })
        .toArray()
        .then((logs) => {
          let buyer = {};
          if (logs) {
            const log = logs.filter((log) => log.action === 'addPrice').pop();
            buyer = log && log.data ? log.data.user : {};
            delete buyer._id;
          }

          global.currentAuction.state = isSold(global.currentAuction) ? 2 : 3;
          return global.db
            .collection('auctions')
            .insertOne({ ...global.currentAuction, buyer, logs, endTime: new Date().getTime() });
        })
        .then(() => this.nextAuction())
        .catch((err) => console.log(err));
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
    this.wss.clients.forEach((client) => {
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
    return (date) => this.exec(date);
  }

  exec(date) {
    // debug
    console.log('job start at ', date);
    //console.log('task.data.auctions: ', this.data.auctions);

    this.initWss();
    this.initCountDown();
    this.updateState(2); // task start, 2: doing
    this.addListenerToAllSocket();
    this.nextAuction();
  }

  addListenerToAllSocket() {
    this.wss.clients.forEach((socket) => {
      if (socket.readyState === 1 && socket.listenerCount('message') === 0) {
        console.log('addListenerToAllSocket!');
        //if (socket.listenerCount('message') > 0) socket.off('message');
        socket.on('message', (_msg) => {
          try {
            // [debug]
            console.log('Received message: ', _msg);
            const msg = JSON.parse(_msg);
            // save to logs
            //this.logger.save('receiveMsg', msg);
            if (msg.action === 'addPrice') {
              this.addPrice(msg);
            }else if(msg.action === 'hello'){
              this.sayHellow(socket);
            }
          } catch (error) {
            console.log(error);
          }
        });

        socket.on('close', function () {
          console.log('websocket connection closed');
        });
      }
    });
  }

  handleConnection(socket, req) {
    // [debug]
    console.log('client ip: ', req.connection.remoteAddress);
    console.log('client token: ', req.headers.token);
    console.log('app token: ', req.headers.apptoken);

    this.sayHellow(socket);
    this.addListenerToAllSocket();
  }

  sayHellow(socket) {
    if (!global.currentAuction) {
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
      global.currentAuction && global.currentAuction.car && global.currentAuction.car.plateNum
    );

    global.currentAuction = this.data.auctions.shift();
    if (!global.currentAuction) {
      // [debug]
      console.log('task ', this.data.id, 'completed!');
      this.updateState(3); 
      this.closeAllSocket();
      //this.wss.removeAllListeners('connection');
    } else {
      // [debug]
      console.log('next auction carid: ', global.currentAuction.car.plateNum);

      global.currentAuction.state = 1; // 1: go
      global.currentAuction.startPrice = global.currentAuction.price;
      global.currentAuction.startTime = new Date().getTime();
      this.countDown.reset(20 * 60);
    }
    this.broadcast();
    return this;
  }

  closeAllSocket() {
    this.wss.clients.forEach((client) => {
      // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
      if (client.readyState === 1) {
        client.close();
      }
    });
  }

  getCurrent() {
    try {
      if (!global.currentAuction) return {};
      const { state, price, reserve } = global.currentAuction;
      const carid = global.currentAuction.car.plateNum;
      return { state, price, reserve, carid, time: this.countDown.get() };
    } catch (error) {
      console.log('getCurrent(): ', error);
    }
  }

  async addPrice(msg) {
    console.log('addPrice() msg: ', msg);
    if (!global.currentAuction) return this;

    if (msg.carid !== global.currentAuction.car.plateNum) {
      console.log('addPrice: carid error!');
      return this;
    }

    const user = await getUser(msg.user);
    if (!user) {
      console.log('addPrice: deny!');
      return this;
    }

    if (typeof global.currentAuction.price == 'string') global.currentAuction.price = parseInt(global.currentAuction.price);
    global.currentAuction.price += parseInt(msg.addNum);
    if (global.currentAuction.price >= global.currentAuction.reserve) {
      // start 20s 计时器
      this.countDown.reset(20);
    }
    this.broadcast();
    // save to logs
    delete user._id;
    msg.user = user;
    this.logger.save('addPrice', msg);
    return this;
  }
}

class Logger {
  constructor(tag = ['auction'], col = global.db.collection('logs')) {
    this.tag = tag;
    this.col = col;
  }

  save(action, data) {
    return this.col.insertOne({ tag: this.tag, date: new Date(), action, data }).catch((err) => console.log(err));
  }

  find() {}
}

//---------------------------------------------------------------

function wssCb(obj) {
  assert.equal('function', typeof obj.handleConnection);
  return function (socket, req) {
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
  return sid2openid(sid).then((openid) => global.db.collection('users').findOne({ openid }));
}

function isSold(auc) {
  return parseInt(auc.price) >= parseInt(auc.reserve);
}

function updateStageState(id, state) {
  global.debug && console.log('updateStageState: id= ', id, ' state = ', state);
  return global.db
    .collection('stages')
    .updateOne({ id }, { $set: { state } }, { upsert: false })
    .catch((err) => console.log(err));
}

function sid2openid(sid) {
  return global.db
    .collection('sessions')
    .findOne({ sid })
    .then((r) => r && r.openid)
    .catch((err) => console.log(err));
}

module.exports = { Task, CountDown, sid2openid };
