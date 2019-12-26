
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
//const fs = require('fs');
const express = require('express');
const app = express();
//const EventProxy = require('eventproxy');
//const session = require('./session.js').session;
//const MongoClient = require('mongodb').MongoClient;
const SocketServer = require('ws');
const { httpsOptions } = require('./config');

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
            client.send(JSON.stringify({ msg: data }));
        }
    });
};

wss.on('connection', function (socket, req) {
    const ip = req.connection.remoteAddress;
    console.log("wss.clients.size: ", wss.clients.size);
    console.log("client ip: ", ip);
    //console.log("client headers: ", req.headers);

    socket.on('message', function (msg) {
        console.log(`Received message ${msg}`);
    });

    let n = 0;
    setInterval(() => {
        socket.send(JSON.stringify({ price: n++ }), { binary: false });
        if (n == 60) broadcast('broadcast!');
    }, 1000);
    //socket.send(JSON.stringify({ price: 5 }), {binary: false});

    socket.on('close', function () {
        console.log("websocket connection closed");
    });
});