
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const SocketServer = require('ws');
const url = require('url');
//const fs = require('fs');
const express = require('express');
const app = express();
const { Task, Auction, CountDown } = require('./common.js');
const { tasks } = require('./mock');
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

    const server = https.createServer(httpsOptions, app);
    const wss1 = new WebSocket.Server({ noServer: true });
    const wss2 = new WebSocket.Server({ noServer: true });

    server.on('upgrade', function upgrade(request, socket, head) {
        const pathname = url.parse(request.url).pathname;
      
        if (pathname === '/') {
          wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit('connection', ws, request);
          });
        } else if (pathname === '/bar') {
          wss2.handleUpgrade(request, socket, head, function done(ws) {
            wss2.emit('connection', ws, request);
          });
        } else {
          socket.destroy();
        }
      });

    const port = 443;
    server.listen(port, function () {
        console.log('https server is running on port ', port);
    });

    //---------------------------------------------------------------------------------------
    const EventEmitter = require('events');
    class DataBus extends EventEmitter { };
    const dataBus = new DataBus();// for trigger next auction
    //const wss = new SocketServer.Server({ server });
    /**
     * add broadcast method to object wss
     * @param {JSON} data will bo to send
     */
    wss1.broadcast = function (data = {}) {
        this.clients.forEach(client => {
            // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
            if (client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
        });
    }

    // test case ----------------------------------------------------------------------------
    //const col = global.db.collection('tasks');
    //get tasks array from db, but exclude 'temp' 0f tag
    //const tasks = await col.find({}).toArray();

    // ev.on('next', () => {
    //     if(job)job.cancel();
    //     const task = tasks.shift();
    //     if (task) {
    //         console.log("next task: ", task);// [debug]
    //         job = new Task(wss, ev).createJob(task);
    //     } else {
    //         console.log("all jobs is completed!");
    //     }
    // });
    // ev.emit('next');

    //============================================================
    // function testAuction(auc) {
    //     const countDown = new CountDown(ev);
    //     const auction = new Auction(wss, countDown);
    //     auction.start(auc);
    //     ev.on('next', res => console.log("next event: ", res));
    // }


    function nextJob(tasks) {
        console.log('getNextJob(): ');
        const task = tasks.shift();
        return createJob(task, wss1);
    }

    function tasks2jobs() {
        const jobs = new Map();
        return tasks.map(task => {
            return createJob(wss1, task);
        });
    }

    const job = nextJob(tasks);
    console.log("current job: ", job);

})();
