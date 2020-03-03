const assert = require('assert');
const { inspect } = require('util');
//const xml2js = require('xml2js');//use to wechat moudle
const https = require('https');
const WebSocket = require('ws');
const url = require('url');
//const fs = require('fs');
const express = require('express');
const app = express();
const { Task } = require('./common.js');
const { tasks } = require('./mock');
const schedule = require('node-schedule');
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
    app.use('/mymind', express.static('../my-mind'));
    app.use('/mindmaps', express.static('../mindmaps/dist'));
    app.use('/drawio', express.static('../drawio/src/main/webapp'));

    //------------------------------------------------------------------------

    const server = https.createServer(httpsOptions, app);
    //const wss = new SocketServer.Server({ server });
    const wss1 = new WebSocket.Server({ noServer: true });
    const wss2 = new WebSocket.Server({ noServer: true });
    const wsss = new Map([['yz', wss1], ['nz', wss2]]);
    // [debug]
    //console.log('wsss: ', wsss);

    server.on('upgrade', function upgrade(request, socket, head) {
        const pathname = url.parse(request.url).pathname;

        if (pathname === '/') {
            wss1.handleUpgrade(request, socket, head, function done(ws) {
                wss1.emit('connection', ws, request);
            });
        } else if (pathname === '/nz') {
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

    //---------------------------------------------------------------
    const EventEmitter = require('events');
    class DataBus extends EventEmitter {
        constructor(wss, tasks) {
            super();
        }
    };

    const obj_tasks = {
        tasks: [],
        exec: async function load(date) {
            // [debug]
            console.log("mainJob started at ", date);

            try {
                // get tasks data from mongodb in one houre
                const _tasks = await findTasks();
                // [debug]
                //console.log('_tasks: ', _tasks);
                this.tasks = tasks2jobs(wsss, _tasks);
                // [debug]
                //console.log("taskObjects: ", this.tasks);
            } catch (error) {
                console.log(error);
            }
        },
        getTask: function (appToken = 0) {
            return this.tasks.find(task => task.data.appToken == appToken && task.data.state == 2);
        }
    };

    const mainJob = schedule.scheduleJob(new Date('2021-02-27 11:00'), cb(obj_tasks));
    // [debug]
    //console.log('inspect mainJob: ', inspect(mainJob));
    mainJob.job('manual exec');

})();


//-----------------------------------------------

function cb(obj) {
    return function (date) {
        obj.exec(date);
    };
}

function findTasks(col) {
    return Promise.resolve(tasks);
}

/**
 * 
 * @param { EventEmitter } wss 
 * @param { Array } tasks 
 * @returns { Task } 
 */
function tasks2jobs(wsss, tasks) {
    return tasks.map(task => {
        return new Task(wsss, task);
    });
}