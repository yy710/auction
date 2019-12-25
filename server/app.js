
const assert = require('assert');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const fs = require('fs');
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
let wss = new SocketServer.Server({server});

wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        if (client.readyState === SocketServer.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', function (socket, req) {
    console.log("wss.clients.size: ", wss.clients.size);

    socket.on('message', function (message) {
        console.log('received: %s', message);
    });

    //socket.send(JSON.stringify(products), {binary: false});
    //socket.send(products, { binary: false });

    socket.on('close', function () {
        console.log("websocket connection closed");
    });
});