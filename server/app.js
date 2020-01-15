
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const SocketServer = require('ws');
//const fs = require('fs');
const express = require('express');
const app = express();
const { tasks2Jobs, _startAuction, CountDown, Auction } = require('./common.js');
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
    const wss = new SocketServer.Server({ server });
    //const jobs = await tasks2Jobs(wss, global.db);

    // test case ----------------------------------------------------------------------------
    const EventEmitter = require('events');
    class MyEventEmitter extends EventEmitter { };
    const ev = new MyEventEmitter();// for trigger next auction
    const countDown = new CountDown(ev);

    const auctions = [];
    auctions.push({ state: 0, price: 1000, reserve: 5000, carid: 0 });
    auctions.push({ state: 0, price: 2000, reserve: 6000, carid: 1 });
    auctions.push({ state: 0, price: 3000, reserve: 7000, carid: 2 });

    //const startAuction = _startAuction(wss, countDown);
    //const genExecAuction = execAuction(auctions);
    //let auction = genExecAuction.next();
    //startAuction(auctions.shift());

    const auction = new Auction(wss, countDown);
    auction.start(auctions.shift());

    ev.on('next', function (_auc) {
        //assert.equal(auction.id, auid);
        const auc = auctions.shift()
        console.log("trigger timeout of event! ", _auc.price);
        //const auc = genExecAuction.next(100);
        if (!auc) {
            console.log("auctions end! current price");
            // update db

            // cancel this job

        } else {
            console.log("auction continue: ", auc)
            auction.start(auc);
            // update db

        }
    });

    function* execAuction(aucs) {
        for (i = 0; i < aucs.length; i++) {
            const inData = yield aucs.shift();
            console.log("inData: ", inData);
        }
        return { code: 1 };
    }
})();
