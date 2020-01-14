const assert = require('assert');
const schedule = require('node-schedule');
const EventEmitter = require('events');
class MyEventEmitter extends EventEmitter { };

async function tasks2Jobs(_wss, db) {
    const jobs = []
    const col = db.collection('tasks');
    //get tasks array from db, but exclude 'temp' 0f tag
    const tasks = await col.find({}).toArray();
    tasks.forEach(task => {
        const job = schedule.scheduleJob(task.start_time, function () {
            // debug
            console.log('job start! ', new Date().toLocaleString());

            const auctions = task.auctions;
            let auction = auctions.shift();
            const ev = new MyEventEmitter();// for trigger next auction, every task has one ev
            const startAuction = _startAuction(_wss, ev);
            startAuction(auction);

            ev.on('next', function (auid) {
                assert.equal(auction.id, auid);
                if (auctions.length == 0) {
                    // update db

                    // cancel this job

                } else {
                    auction = auctions.shift();
                    // update db

                    startAuction(auction);
                }
            });
        });
        jobs.push(job);
    });
    return jobs;
}

class CountDown {
    constructor(ev, time = 0) {
        this.endTime = 0;
        this.ev = ev;
        this.timer = null;
        this.start(time);
    }

    get() {
        const time = this.endTime - new Date().getTime();
        return time < 0 ? 0 : time;
    }

    start(time) {
        this.endTime = new Date().getTime() + time * 1000;
        this.timer = setTimeout(() => this.ev.emit('timeout', ''), time * 1000);
        return this;
    }

    reset(time = 60) {
        clearTimeout(this.timer);
        this.start(time);
        return this;
    }
}

// closure 函数, currying
function _startAuction(wss, countDown) {
    return function (auc) {
        wss.removeAllListeners('connection');
        countDown.reset(20 * 60);
        let { state, price, reserve, carid } = auc;
        state = 1;
        broadcast({ price, time: countDown.get(), state, carid });
        
        wss.on('connection', function (socket, req) {
            const ip = req.connection.remoteAddress;
            console.log("wss.clients.size: ", wss.clients.size);
            console.log("client ip: ", ip);
            console.log("client token: ", req.headers.token);

            socket.send(JSON.stringify({ price, time: countDown.get(), state, carid }), { binary: false });// time is left millseconds 

            // --------------------------------------------------------
            socket.on('message', function (_msg) {
                const msg = JSON.parse(_msg);
                console.log("Received message: ", msg);
                if (msg.price) {
                    price += msg.price;
                    if (price >= reserve) {
                        // start 20s 计时器
                        countDown.reset();
                    }
                    // reset price, time for all
                    broadcast({ price, time: countDown.get(), state, carid });
                }
            });

            socket.on('close', function () {
                console.log("websocket connection closed");
            });
        });

        function broadcast(data) {
            wss.clients.forEach(function (client) {
                // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
                if (client.readyState === 1) {
                    client.send(JSON.stringify(data));
                }
            });
        };

        return wss;
    };
}

// 单个竞价产品类
class Auction {
    constructor(data) {
        // data: {
        //   state  0: ready, 1: go, 2: end, 3: 流拍
        //   price  起拍价
        //   reserve  保留价
        //   carid 产品id
        //   winnerid 最终胜者id
        //   logs 竞价过程记录
        // }
        this.data = data;
        this.ee = ee;
        this.countDown = null;// 计时器对象
    }

    inReserve() {
        return this.data.price < this.data.reserve;
    }

    start(wss, ee) {
        this.data.state = 1;
        this.countDown = new CountDown(20 * 60);
        const that = this;
        wss.on('connection', function (socket, req) {
            const ip = req.connection.remoteAddress;
            console.log("wss.clients.size: ", wss.clients.size);
            console.log("client ip: ", ip);
            console.log("client token: ", req.headers.token);

            const time = that.countDown.get();
            socket.send(JSON.stringify({ price: that.data.price, time, state: that.data.state }), { binary: false });// time is left millseconds 

            // --------------------------------------------------------
            socket.on('message', function (_msg) {
                const msg = JSON.parse(_msg);
                console.log("Received message: ", msg);
                if (msg.price) {
                    that.data.price += msg.price;
                    if (!that.inReserve()) {
                        // start 20s 计时器
                        that.countDown.reset();
                    }
                    // reset price, time for all
                    broadcast({ price: that.data.price, time: countDown.get(), state: that.data.state });
                }
            });

            socket.on('close', function () {
                console.log("websocket connection closed");
            });
        });

        return this;
    }
}

// 定义竞价场次类
class Task {
    constructor(data, ee = new MyEventEmitter()) {
        // data: {
        //   state = 0; // 状态
        //   startDate = date; // 竞价场次开始时间
        //   auctions = []; // 排队竞价的产品列表
        // }
        this.data = data;
        this.ee = ee;
        this.auction = null; // 当前正在竞价的产品，注意这是一个 Auction 对象
    }

    addTask(auction) {
        this.data.auctions.push(auction);
        // write to db

        return this;
    }

    begin() {
        if (this.data.auctions.length != 0) {
            this.next();
        }
        return this;
    }

    next() {
        this.auction = new Auction(this.data.auctions.shift());
        this.auction.start(ee);
        return this;
    }
}

module.exports = { tasks2Jobs, _startAuction, CountDown };