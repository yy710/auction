const assert = require('assert');
const { inspect } = require('util');
//const xml2js = require('xml2js');//use to wechat module
const https = require('https');
const WebSocket = require('ws');
const url = require('url');
//const fs = require('fs');
const express = require('express');
const app = express();
const { Task } = require('./common.js');
const { tasks } = require('./mock');
const schedule = require('node-schedule');
const axios = require('axios');
//const bodyParser = require('body-parser')
//const http = require('http');
//const xmlparser = require('express-xml-bodyparser');
const MongoClient = require('mongodb').MongoClient;
// 载入配置文件
global.config = require('./config.js');
const { httpsOptions, dbUrl, debug, uploadPath, workWeixin } = global.config;
global.uploadPath = uploadPath;
global.debug = debug;

const routerAuction = require('./router-auction.js');
const routerLottery = require('./router-lottery.js');
const routerHoliday51 = require('./router-holiday51.js');
const setWss3 = require('./ws-lottery');

const EventProxy = require('./eventproxy.js');
global.ep = new EventProxy();
//const session = require('./session.js').session;

const cors = require('cors');
app.use(cors());

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

(async function () {
  // init mogodb connection
  if (!global.db) {
    // static method
    const client = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
    console.log('Connected successfully to mongodb server');
    global.db = client.db('auction');
  }

  app.use('/yz/auction', routerAuction(express));
  app.use('/yz/lottery', routerLottery(express));
  app.use('/yz/holiday51', routerHoliday51(express));
  app.use('/yz/auction/images', express.static(global.uploadPath));
  app.use('/mymind', express.static('../my-mind'));
  app.use('/mindmaps', express.static('../mindmaps/dist'));
  app.use('/drawio', express.static('../drawio/src/main/webapp'));
  app.use('/yzcj', express.static('./h5'));
  app.use('/yzauction', express.static('./yz-auction'));
  app.use('/yzauction-qrcode', express.static('./qrcode'));

  //----------------------------------------------------------------
  const server = https.createServer(httpsOptions, app);
  //const wss = new SocketServer.Server({ server });
  const wss1 = new WebSocket.Server({ noServer: true });
  const wss2 = new WebSocket.Server({ noServer: true });
  const wss3 = new WebSocket.Server({ noServer: true });
  setWss3(wss3);
  global.wss3 = wss3;

  const wsss = new Map([
    ['yz_auction', wss1],
    ['nz', wss2],
    ['yz_lottery', wss3]
  ]);

  server.on('upgrade', function upgrade(request, socket, head) {
    //console.log('websocket upgrade request.headers: ', request.headers);
    //console.log('websocket upgrade request.url: ',request.url);
    const pathname = url.parse(request.url).pathname;
    //console.log('pathname: ', pathname);
    const apptoken = request.headers.apptoken;
    socket.sid = request.headers.token || request.headers.sid;
    //global.db.collection('sessions').findOneAndUpdate();

    // if (!wsss.has(apptoken)) {
    //   console.log('websocket upgrade apptoken error!');
    //   socket.destroy();
    //   return 0;
    // }

    if (pathname === '/yz') {
      wss1.handleUpgrade(request, socket, head, function done(ws) {
        wss1.emit('connection', ws, request);
      });
    } else if (pathname === '/nz') {
      wss2.handleUpgrade(request, socket, head, function done(ws) {
        wss2.emit('connection', ws, request);
      });
    } else if (pathname === '/lottery') {
      wss3.handleUpgrade(request, socket, head, function done(ws) {
        wss3.emit('connection', ws, request);
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
  const obj_tasks = {
    tasks: [],
    wsss,
    tasksData: [],
    // entrance
    exec: async function load(info) {
      global.debug && console.log('mainJob started at ', info);
      try {
        // get tasks data from mongodb in one houre
        this.tasksData = await this.findTasks();
        //global.debug && console.log('before tasks[0].data: ', this.tasksData[0]);
        this.createTasks();
        global.debug && console.log('tasks[0].data: ', this.tasks[0] && this.tasks[0].data);
        return this;
      } catch (error) {
        console.log(error);
      }
    },
    // avoid by change taskData
    updateTask: function (taskData) {
      const _task = new Task(wsss, taskData);
      let index = this.tasks.findIndex(t => t.data.id == taskData.id);
      if (index !== -1) {
        this.tasks[index] = _task;
      } else {
        this.tasks.push(_task);
      }
      return this;
    },
    findTasks: function (col = global.db.collection('stages')) {
      return col.aggregate([{ $match: { state: { $in: [0, 1] } } }, { $sort: { start_time: 1 } }]).toArray().catch((err) => console.log(err));
    },
    createTasks: function () {
      //this.tasks = this.tasksData.map(taskData => new Task(this.wsss, taskData));
      this.tasksData.forEach(t => {
        this.updateTask(t);
      });
      return this;
    }
  };

  global.obj_tasks = obj_tasks;
  //const mainJob = schedule.scheduleJob(new Date('2021-02-27 11:00'), cb(obj_tasks));
  //const mainJob = schedule.scheduleJob('*/5 8-18 * * *', cb(obj_tasks));
  //mainJob.job('manual exec');
  cb(obj_tasks)('cron');
  global.ep.on('sendMsg', axiosPost);

  // [debug]
  //setTimeout(() => global.ep.emit('sendMsg', 'test'), 5000);

  //------------------------------------------------------------------
  function cb(obj) {
    return date => obj.exec(date);
  }

  function axiosGet(content) {
    return axios
      .get(`http://localhost:3000/send-message?content=${content}`)
      .then((r) => console.log('sendText: ', JSON.stringify(r.data, null, 4)))
      .catch((err) => console.log(err));
  }

  function axiosPost(content) {
    return axios
      .post('http://localhost:3000/send-message', { content })
      .then((r) => console.log('sendText: ', JSON.stringify(r.data, null, 4)))
      .catch((err) => console.log(err));
  }

  async function sendMsg(content) {
    const AccessToken = require('./class-access-token.js');
    const accessToken = new AccessToken(global.config.workWeixin);
    const SendMsg = require('./sent-msg.js');
    const token = (await accessToken.getToken()).token;
    const sendMsg = new SendMsg(token);
    sendMsg.sentText({ content });
  }
})();

