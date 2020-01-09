const schedule = require('node-schedule');

class CountDown {
    constructor(time = 0) {
        this.start(time);
    }

    get() {
        const time = this.endTime - new Date().getTime();
        return time < 0 ? 0 : time;
    }

    start(time) {
        this.endTime = new Date().getTime() + time * 1000;
        return this;
    }

    reset(time = 60) {
        this.start(time);
        return this;
    }
}

// 单个竞价产品类
class Auction {
    constructor() {
        this.state = 0;// 0: ready, 1: go, 2: end, 3: 流拍
        this.price = 0;// 起拍价
        this.reserve = 0;// 保留价
        this.countDown = null;// 计时器
        this.carid = 0;// 产品id
        this.winnerid = 0;// 最终胜者id
        this.logs = [];// 竞价过程记录
    }

    inReserve() {
        return this.price < this.reserve;
    }

    init(au){
        this.data = au;
    }

    start(){
        this.countDown = new CountDown(20 * 60);
        this.state = 1;
        return this;
    }
}

// 定义竞价场次类
class Auctions {
    constructor(date) {
        this.state = 0; // 状态
        this.startDate = date; // 竞价场次开始时间
        this.auctions = []; // 排队竞价的产品列表
        this.auction = null; // 当前正在竞价的产品，注意这是一个 Auction 对象
    }

    addAuction(auction) {
        this.auctions.push(auction);
        return this;
    }

    begin() {
        if(this.auctions.length != 0){
            this.nextAuction();
        }
        return this;
    }

    nextAuction() {
        const auction = this.auctions.shift();
        this.auction = new Auction(auction);
        return this;
    }
}

module.exports = { CountDown, Auction };

const j1 = schedule.scheduleJob('[0,10,20,30,40,50] 8-18 * * *', function () {
    console.log('scheduleJob! ', new Date().toLocaleString());
    //axios.get('http://localhost/yz/referred/cron/minute5').then(r => console.log("get cron1: ", JSON.stringify(r.data, null, 4)));
});
//j1.cancel();