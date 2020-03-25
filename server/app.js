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
app.use((req, res, next) => {
  console.log('req.originalUrl: ', req.originalUrl);
  req.data = {};
  // req.get(field)
  // Returns the specified HTTP request header field (case-insensitive match). The Referrer and Referer fields are interchangeable.
  // req.get('Content-Type')
  // => "text/plain"
  // req.get('content-type')
  // // => "text/plain"
  // req.get('Something')
  // // => undefined
  // Aliased as req.header(field).
  if (req.get('apptoken')) {
    req.data.apptoken = req.get('apptoken');
  } else if (req.query.apptoken) {
    req.data.apptoken = req.query.apptoken;
  } else {
    req.data.apptoken = 'no found!';
  }
  console.log('apptoken: ', req.data.apptoken);
  next();
});

(async function() {
  // init mogodb connection
  if (!global.db) {
    // static method
    const client = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
    console.log('Connected successfully to mongodb server');
    global.db = client.db('auction');
  }

  app.use('/yz/auction/images', express.static(global.uploadPath));
  app.use('/yz/auction', routerAuction(express));
  app.use('/mymind', express.static('../my-mind'));
  app.use('/mindmaps', express.static('../mindmaps/dist'));
  app.use('/drawio', express.static('../drawio/src/main/webapp'));

  //----------------------------------------------------------------
  const server = https.createServer(httpsOptions, app);
  //const wss = new SocketServer.Server({ server });
  const wss1 = new WebSocket.Server({ noServer: true });
  const wss2 = new WebSocket.Server({ noServer: true });
  const wsss = new Map([
    ['yz_auction', wss1],
    ['nz', wss2]
  ]);

  server.on('upgrade', function upgrade(request, socket, head) {
    //console.log('websocket upgrade request.heders: ', request.headers);
    const pathname = url.parse(request.url).pathname;
    const apptoken = request.headers.apptoken;
    socket.sid = request.headers.token;
    //global.db.collection('sessions').findOneAndUpdate();

    if (!wsss.has(apptoken)) {
      console.log('websoket upgrade apptoken error!');
      socket.destroy();
      return 0;
    }

    if (pathname === '/yz') {
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
  server.listen(port, function() {
    console.log('https server is running on port ', port);
  });

  //---------------------------------------------------------------
  const obj_tasks = {
    tasks: [],
    exec: async function load(date) {
      // [debug]
      console.log('mainJob started at ', date);

      try {
        // get tasks data from mongodb in one houre
        const _tasks = await findTasks();
        console.log("_tasks", _tasks);
        this.tasks = tasks2jobs(wsss, _tasks);
      } catch (error) {
        console.log(error);
      }
    },
    getTask: function(appToken = 'yz_auction') {
      return this.tasks.find(task => task.data.appToken == appToken && task.data.state == 2);
    }
  };

  const mainJob = schedule.scheduleJob(new Date('2021-02-27 11:00'), cb(obj_tasks));
  mainJob.job('manual exec');
})();

//------------------------------------------------------------------
function cb(obj) {
  return function(date) {
    obj.exec(date);
  };
}

function findTasks() {
  return global.db
    .collection('stages')
    .aggregate([{ $sort: { start_time: 1 } }])
    .toArray()
    .catch(err => console.log(err));
}

/**
 *
 * @param { Map } wsss
 * @param { Array } tasks
 * @return { Task }
 */
function tasks2jobs(wsss, tasks) {
  return tasks.map(task => {
    return new Task(wsss, task);
  });
}