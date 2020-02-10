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
        this.start(time);
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
        clearTimeout(this.timer);
        this.start(time);
        return this;
    }
}

// 单个竞价产品类
class Auction {
    constructor(wss, countDown) {
        // auc: {
        //   state  0: ready, 1: go, 2: end, 3: 流拍
        //   price  起拍价
        //   reserve  保留价
        //   carid 产品id
        //   winnerid 最终胜者id
        //   logs 竞价过程记录
        // }
        this.auc = {}; // data will save to mongodb
        this.socket = null; // websocket object
        this.countDown = countDown;// 计时器对象
        this.initWss();
    }

    start(auc) {
        this.auc = mergeOptions(auc, this.auc);
        this.auc.state = 1;
        this.countDown.reset(20 * 60);
        //this.initWss();
        this.broadcast();
        return this;
    }

    sendMsg(data = {}) {
        const _data = this.auc;
        _data.time = this.countDown.get();
        this.socket.send(JSON.stringify(mergeOptions(data, _data)));
    }

    initWss(wss) {
        //const that = this;
        wss.removeAllListeners();
        wss.on('connection', (socket, req) => {
            //socket.removeAllListeners('message');
            //this.socket = socket;
            const ip = req.connection.remoteAddress;
            console.log("wss.clients.size: ", this.wss.clients.size);
            console.log("client ip: ", ip);
            console.log("client token: ", req.headers.token);

            //socket.send(JSON.stringify({ price: this.auc.price, time: this.countDown.get(), state: this.auc.state, carid: this.auc.carid }), { binary: false }); 
            this.socket = socket;
            this.sendMsg();

            // handle submit new price --------------------------------------------------------
            this.socket.on('message', _msg => {
                const msg = JSON.parse(_msg);
                console.log("Received message: ", msg);// [debug]
                // save to logs

                if (msg.price) {
                    this.auc.price += msg.price;
                    if (!this.inReserve()) {
                        // start 20s 计时器
                        this.countDown.reset(20);
                    }
                    // reset price, time for all
                    this.broadcast();
                }
            });

            this.socket.on('close', function () {
                console.log("websocket connection closed");
            });

            this.countDown.on('timeout', time => {
                console.log('timeout: ', time);// [debug]

                this.auc.state = 2; // set auction end flag
                // save auc to db

                this.countDown.emit('next', this.auc);
            });
        });
        return this;
    }

    inReserve() {
        return this.auc.price < this.auc.reserve;
    }

    broadcast() {
        this.wss.clients.forEach(client => {
            // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
            if (client.readyState === 1) {
                this.sendMsg(client);
            }
        });
    }
}

// 定义竞价场次对象
const Task = {
    // data: {
    //   tags = []; // multi products
    //   id = 0;
    //   state = 0; // 状态
    //   start_time = new date(); // 竞价场次开始时间
    //   auctions = []; // 排队竞价的产品列表
    // }

    exec(wss, data) {
        // debug
        console.log('job start at ', new Date().toLocaleString());
        //this.wss.removeAllListeners('connection');
        data.state = 1; // set flag: scheduled
        const auctions = data.auctions;
        countDown = new CountDown();
        auction = new Auction(wss, countDown);

        countDown.on('next', lastauc => {
            const auc = auctions.shift()
            console.log("last auction: ", lastauc);// [debug]
            if (!auc) {
                console.log("auction completed!");
                // update db

                // next task
                //this.ev.emit('next', {});
            } else {
                console.log("next auction: ", auc);// [debug]
                auction.start(auc);
                // update db

            }
        });
        countDown.emit('next', {});
    },

    getExec(wss, data, f = null) {
        if (typeof f == 'function') this.exec = f;
        return this.exec;
    },

    addTask(auction) {
        this.data.auctions.push(auction);
        // write to db

        return this;
    },

    createJob(wss, data) {
        return schedule.scheduleJob(data.start_time, this.getExec(wss, data));
    }

}

function mergeOptions(options, defaults) {
    for (var key in defaults) {
        options[key] = options[key] || defaults[key];
    }
    return options;
}

module.exports = { Task, CountDown, Auction };