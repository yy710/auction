
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const SocketServer = require('ws');
//const fs = require('fs');
const express = require('express');
const app = express();
const { CountDown } = require('./common.js');
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
//const EventProxy = require('eventproxy');
//const session = require('./session.js').session;
const routerAuction = require('./router-auction');
app.use('/yz/auction/images', express.static(global.uploadPath));
app.use('/yz/auction', initDb(dbUrl, MongoClient), routerAuction(express));

//---------------------------------------------------------------------------------------

let server = https.createServer(httpsOptions, app);
const port = 443;
server.listen(port, function () {
    console.log('https server is running on port ', port);
});

//---------------------------------------------------------------------------------------
let wss = new SocketServer.Server({ server });

const broadcast = function (data) {
    wss.clients.forEach(function (client) {
        if (client.readyState === SocketServer.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

let price = 0;
const reserve = 6000;
const countDown = new CountDown(20 * 60);
wss.on('connection', function (socket, req) {
    const ip = req.connection.remoteAddress;
    console.log("wss.clients.size: ", wss.clients.size);
    console.log("client ip: ", ip);
    console.log("client token: ", req.headers.token);

    const time = countDown.get();
    socket.send(JSON.stringify({ price, time, state: 'go' }), { binary: false });// time is left millseconds 

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
            broadcast({ price, time: countDown.get(), state: 'go' });
        }
    });

    socket.on('close', function () {
        console.log("websocket connection closed");
    });
});

/**
 * pure function to return middleware for init mongodb 
 * @param {string} url connect string
 * @param {object} mc MongoClient
 * @returns middleware for express
 */
function initDb(url, mc) {
    return function (req, res, next) {
        req.data = {};
        if (!global.db) {
            // static method
            mc.connect(url, { useUnifiedTopology: true }, function (err, client) {
                assert.equal(null, err);
                //if(err)throw err;
                console.log("Connected successfully to mongodb server");
                global.db = req.data.db = client.db("auction");
                //client.close();
                next();
            });
        } else {
            req.data.db = global.db;
            next();
        }
    };
}