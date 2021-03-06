
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const SocketServer = require('ws');
//const fs = require('fs');
const express = require('express');
const app = express();
const { Task, Auction, CountDown } = require('./common.js');
//const bodyParser = require('body-parser')
//const http = require('http');
//const xmlparser = require('express-xml-bodyparser');
//const axios = require('axios');
//const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
// 载入配置文件
const { httpsOptions, dbUrl, debug, uploadPath } = require('./config.js');
global.uploadPath = uploadPath;
global.debug = debug;
const routerAuction = require('./router-auction');
//const EventProxy = require('eventproxy');
//const session = require('./session.js').session;

// init mogodb connection
(async function () {
    if (!global.db) {
        // static method
        const client = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
        console.log("Connected successfully to mongodb server");
        global.db = client.db("auction");
    }

    app.use('/yz/auction/images', express.static(global.uploadPath));
    app.use('/yz/auction', routerAuction(express));

    //---------------------------------------------------------------------------------------

    let server = https.createServer(httpsOptions, app);
    const port = 443;
    server.listen(port, function () {
        console.log('https server is running on port ', port);
    });

    //---------------------------------------------------------------------------------------
    const EventEmitter = require('events');
    class MyEventEmitter extends EventEmitter { };
    const ev = new MyEventEmitter();// for trigger next auction
    const wss = new SocketServer.Server({ server });
    //let task = null;
    let job = null;

    // test case ----------------------------------------------------------------------------
    //const col = global.db.collection('tasks');
    //get tasks array from db, but exclude 'temp' 0f tag
    //const tasks = await col.find({}).toArray();

    const auctions1 = [];
    auctions1.push({ state: 0, price: 1000, reserve: 5000, carid: 0 });
    auctions1.push({ state: 0, price: 2000, reserve: 6000, carid: 1 });
    auctions1.push({ state: 0, price: 3000, reserve: 7000, carid: 2 });
    const auctions2 = [];
    auctions2.push({ state: 0, price: 5000, reserve: 8000, carid: 3 });
    auctions2.push({ state: 0, price: 6000, reserve: 9000, carid: 4 });
    auctions2.push({ state: 0, price: 7000, reserve: 10000, carid: 5 });
    const tasks = [];
    tasks.push({ id: 0, state: 0, auctions: auctions1, start_time: new Date('2020-01-16 22:32') });
    tasks.push({ id: 1, state: 0, auctions: auctions2, start_time: new Date('2020-01-16 22:35') });

    ev.on('next', () => {
        if(job)job.cancel();
        const task = tasks.shift();
        if (task) {
            console.log("next task: ", task);// [debug]
            job = new Task(wss, ev).createJob(task);
        } else {
            console.log("all jobs is completed!");
        }
    });
    ev.emit('next');

    //============================================================
    function testAuction() {
        const countDown = new CountDown(ev);
        const auction = new Auction(wss, countDown);
        auction.start(auctions1[0]);
        ev.on('next', res => console.log("next event: ", res));
    }

    function testTask() {
        const job = new Task(wss, ev).createJob(tasks[0]);
    }


})();
