const multer = require('multer');
const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const { AppID, AppSecret, JisuAppkey } = require('./config.js');
//const { stages } = require('./mock');
const { sid2openid } = require('./common.js');
const WXBizDataCrypt = require('./WXBizDataCrypt');
const accessToken = require('./access_token.js');
const SendMsg = require('./sent-msg.js');
const Logger = require('./class-logger.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, global.uploadPath);
  },
  filename: function (req, file, cb) {
    const suffix = file.originalname.split('.').pop();
    cb(null, randomString() + new Date().getTime() + '.' + suffix);
  }
});
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });
const crypto = require('crypto');

module.exports = function (express) {
  const router = express.Router();
  //const routerJsapiTicket = express.Router();
  router.post(
    '/upload-photos',
    // async function
    upload.single('photos'),
    async function (req, res, next) {
      //console.log("Enter sync function...");
      const r = await wait500(10);
      //console.log("waiting...", r);
      next();
    },
    function (req, res, next) {
      //console.log("req.file: ", req.file);
      //console.log("req.body: ", req.body);

      // req.files = [
      //     {
      //         fieldname: 'photos',
      //         originalname: 'wx8386f47c6190b05b.o6zAJsyw5NP-kR_Nb5jTrOXriaio.bt9vg7PFU3G73a597e77ebe1abd0ba35b674e3fa20f3.jpg',
      //         encoding: '7bit',
      //         mimetype: 'image/jpeg',
      //         destination: 'uploads/',
      //         filename: '360014f4a7d441b0e5780dced181dc46',
      //         path: 'uploads/360014f4a7d441b0e5780dced181dc46',
      //         size: 17407
      //     }
      // ]

      const { filename, path, size } = req.file;
      const image = { filename, path, size };
      //delete image.originalname;
      //image.creater = { id: 0, name: 'unknown', mobile: 0 };
      image.create_time = new Date();
      delete req.body.sid;
      const col = global.db.collection('images');
      col
        .insertOne({ ...image, ...req.body })
        .then(() => {
          const url = 'https://www.all2key.cn/yz/auction/images/' + req.file.filename;
          res.json({ msg: 'upload files ok!', url, filename: req.file.filename });
        })
        .catch(err => console.log(err));
    }
  );

  // get user info
  router.use(async function (req, res, next) {
    try {
      const { sid } = req.query;
      const openid = await sid2openid(sid);
      //console.log("openid: ", openid);
      const _user = await global.db.collection('users').findOne({ openid });
      const user = { ..._user, openid };
      if (!req.data) req.data = {};
      req.data.user = user;
      req.query.user = user;
      //console.log("req.data: ", req.data);
      next();
    } catch (error) {
      console.log(error);
    }
  });

  router.get('/delete-photo', function (req, res, next) {
    assert.notEqual(null, req.query.filename);
    const filename = req.query.filename;
    deleteImage(filename)
      .then(r => res.json(r))
      .catch(err => console.log(err));
  });

  router.get('/get-stage', async function (req, res, next) {
    const carid = req.query.carid || (global.currentAuction && global.currentAuction.car.plateNum) || null;
    global.debug && console.log('get-stage/carid: ', carid);

    if (!carid) {
      return res.json({ code: 0, msg: '当前没有正在竞价车辆！', content: '' });
    }

    try {
      // find stage from carid
      const stage = await global.db.collection('stages').findOne({ 'auctions.car.plateNum': carid });
      const auction = stage.auctions ? stage.auctions.find(item => item.car.plateNum == carid) : {};
      const { registerDate, carTitle, mileage, carType, images, carDescrible, plateNum } = auction.car;

      delete carType._id;
      delete carType.carlist;

      const { user } = req.query;
      //console.log(user);
      const msg = {
        code: 1,
        msg: 'success',
        content: {
          stageStartTime: stage.start_time,
          stageState: stage.state,
          stageId: stage.id,
          startPrice: auction.price / 10000,
          reservePrice: auction.reserve,
          auctionState: auction.state,
          carInfo: { plateNum, registerDate, carTitle, mileage, carDescrible },
          carType,
          imageURLs: images.map(item => `https://www.all2key.cn/yz/auction/images/${item.filename}`),
          prePrice: await getPrePrice(user, carid)
        }
      };
      res.json(msg);
    } catch (error) {
      console.log(error);
      res.json({ code: 0, msg: 'fail' });
    }

    function getPrePrice(user, carid) {
      return new Logger()
        .findAction('addPrePrice', { 'data.carid': carid, 'data.user.openid': user.openid })
        .then(logs => {
          if (Array.isArray(logs) && logs.length > 0) {
            return logs.pop().data.prePrice;
          }
          return 0;
        })
        .catch(err => console.log(err));
    }
  });

  router.get('/get-car', async function (req, res, next) {
    const plateNum = req.query.carid;
    const car = await global.db.collection('cars').findOne({ plateNum });
    res.json({ code: 0, msg: 'ok', car });
  });

  router.get('/login', async function (req, res, next) {
    const { code } = req.query;
    assert.notEqual(null, code);
    let session = null;

    try {
      if (code === 'HBuildX') {
        // uni-app login
        session = { session_key: code, openid: randomString(28), time: new Date() };
      } else {
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
        session = (await axios.get(url)).data;
        //console.log("jscode2session: ", session);
        //session: { session_key: 'zqzM4lY5QMtAWOGQaFBEig==', openid: 'o9Y585eAFqkm6WrDO6nEKmHIeqMc' }
      }
      session.sid = createSid(session);
      console.log('create session: ', session);
      await global.db.collection('sessions').replaceOne({ openid: session.openid }, session, { upsert: true });
      res.json({ errcode: 0, msg: 'success!', sid: session.sid });
    } catch (error) {
      console.log('login error', error);
    }

    function createSid(data, hash = crypto.createHash('md5')) {
      hash.update(JSON.stringify(data, null, 2));
      return hash.digest('hex').slice(-12);
    }
  });

  router.get('/vin', async function (req, res, next) {
    assert.notEqual(null, req.query.vin);
    const vin = req.query.vin;
    const col = global.db.collection('vins');

    let carType = await col.findOne({ vin });
    if (!carType) {
      console.log(`will query vin: ${vin} from api.jisuapi.com`);

      const url = `https://api.jisuapi.com/vin/query?appkey=${JisuAppkey}&vin=${vin}`;
      carType = (await axios.get(url)).data.result;
      await col.insertOne(carType);
    }
    res.json({ code: 1, carType });
  });

  router.get('/check-session', async function (req, res, next) {
    assert.notEqual(null, req.query.sid);
    try {
      const sid = req.query.sid;
      const session = await global.db.collection('sessions').findOne({ sid });
      const user = session ? await global.db.collection('users').findOne({ openid: session.openid }) : null;
      user && delete user._id;
      res.json({ code: !!session, user });
    } catch (error) {
      console.log('check-session: ', error);
    }
  });

  router.get('/save-car', async function (req, res, next) {
    const sid = req.query.sid;
    const data = JSON.parse(req.query.data);
    global.debug && console.log('save-car: ', data);
    const plateNum = data.car.plateNum;
    const userInfo = data.userInfo;
    const carType = data.carType;
    updateUserInfo(sid, userInfo).catch(err => console.log(err));
    // operator save to logs

    delete data.userInfo;
    delete data.sid;
    // get images
    const images = await global.db.collection('images').find({ car_plat_num: plateNum }).toArray();
    const car = { ...data.car, carType, images, stageid: '' };
    try {
      await global.db.collection('cars').replaceOne({ plateNum }, car, { upsert: true });
      res.json({ msg: 'ok', errcode: 0 });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'opreate db error!', errcode: 1 });
    }
  });

  router.get('/get-stages', function (req, res, next) {
    const col = global.db.collection('stages');
    col
      .find({ state: { $in: [0, 1] } })
      .toArray()
      .then(stages => {
        //console.log("get-stages: ", stages);
        res.json({ msg: 'ok', stages });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-mycar', async function (req, res, next) {
    const { sid } = req.query;
    assert.notEqual(null, sid);
    const openid = await sid2openid(sid);
    const user = await global.db.collection('users').findOne({ openid });
    //console.log('get-mycar openid: ', openid);
    const mycars = await global.db.collection('auctions').find({ 'buyer.openid': openid }).toArray();
    //console.log('mycars: ', mycars);
    const cars = mycars.map(item => {
      return {
        plateNum: item.car.plateNum,
        price: item.buyer.price,
        title: item.car.carTitle,
        imageURL: 'https://www.all2key.cn/yz/auction/images/' + item.car.images[0].filename
      };
    });
    res.json({ errcode: 0, msg: 'ok', content: { user, cars } });
  });

  router.get('/get-history', function (req, res, next) {
    const { carid } = req.query;
    assert.notEqual(null, carid);
    global.db
      .collection('auctions')
      .findOne({ 'car.plateNum': carid })
      .then(auction => {
        const content = auction.logs
          .filter(log => log.action === 'addPrice')
          .map(log => {
            const { price, addNum } = log.data;
            return {
              text: new Date(log.date).toLocaleString(),
              desc: `${log.data.user.userInfo.nickName}-${log.data.user.mobile}出价: ¥${addNum} + ¥${price} = ¥${parseInt(price) + parseInt(addNum)}`
            };
          });
        res.json({ msg: 'ok', reserve: auction.reserve, content });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-auctions', function (req, res, next) {
    const col = global.db.collection('auctions');
    col
      .find({})
      .toArray()
      .then(auctions => {
        //console.log("get-stages: ", stages);
        const content = auctions.map(auction => {
          return {
            title: auction.car.carTitle,
            plateNum: auction.car.plateNum,
            thumb: 'https://www.all2key.cn/yz/auction/images/' + auction.car.images[0].filename,
            startTime: auction.startTime,
            endTime: auction.endTime,
            startPrice: auction.startPrice,
            endPrice: auction.buyer ? auction.buyer.price : 0,
            reservePrice: auction.reserve,
            //logs: auction.logs,
            tag: auction.state === 2 ? '已成交' : '流拍',
            buyer: auction.buyer
          };
        });
        res.json({ msg: 'ok', content });
      })
      .catch(err => console.log(err));
  });

  router.get('/update-stage-start-time', function (req, res, next) {
    console.log('req.query: ', req.query);
    const { id, start_time } = req.query;
    global.db
      .collection('stages')
      .updateOne({ id }, { $set: { start_time } })
      .then(() => {
        global.obj_tasks.exec('update-stage-start-time');
        res.json({ errcode: 0, msg: 'ok' });
      })
      .catch(err => console.log(err));
  });

  router.get('/save-stage', async function (req, res, next) {
    //console.log('save-stage query: ', req.query);
    const { stageid, startPrice, reservePrice, platNum } = req.query;
    const yz = { openid: 'yz_auction', mobile: '00000000000', userInfo: { nickName: 'yz_auction' } };
    const auction = {
      state: 0,
      price: parseInt(startPrice),
      reserve: parseInt(reservePrice),
      car: await global.db.collection('cars').findOne({ plateNum: platNum }),
      reserveUser: yz
    };
    //console.log('save-stage/auction: ', auction);
    const r = await global.db.collection('stages').updateOne({ id: stageid }, { $push: { auctions: auction } });
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);
    //await global.db.collection('cars').deleteOne({ plateNum: platNum });
    await global.db.collection('cars').updateOne({ plateNum: platNum }, { $set: { stageid } }, { upsert: false });
    const logger = new Logger();
    logger.save('addPrePrice', {
      prePrice: parseInt(reservePrice),
      carid: platNum,
      user: yz
    });
    global.obj_tasks.exec('save-stage');
    res.json({ errcode: 0, msg: '竞价信息已保存！' });
  });

  router.get('/add-stage', function (req, res, next) {
    const newStage = JSON.parse(req.query.newStage);
    if (req.data.apptoken) newStage.apptoken = req.data.apptoken;
    newStage.id = randomString();
    //newStage.create_time = new Date().getTime();
    // save to db
    const col = global.db.collection('stages');
    col
      .replaceOne({ id: newStage.id }, newStage, { upsert: true })
      .then(r => {
        res.json({ msg: 'ok' });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-cars', async function (req, res, next) {
    const cars = [];
    const auctions = await global.db.collection('auctions').find().toArray();
    const stages = await global.db
      .collection('stages')
      .find({ state: { $in: [0, 1, 2] } })
      .toArray();
    stages.length > 0 &&
      stages.forEach(stage => {
        if (stage.auctions.length > 0)
          stage.auctions.forEach(auction => {
            const content = {
              id: auction.car.plateNum,
              tag: { id: 0, type: 'warning', color: 'green', msg: '等待竞价开始' },
              imageURL: 'https://www.all2key.cn/yz/auction/images/' + auction.car.images[0].filename,
              title: auction.car.carTitle,
              carTime: auction.car.registerDate,
              gongLi: auction.car.mileage / 10000,
              price: parseInt(auction.car.price) / 10000,
              firstPay: auction.car.carType.price,
              price: auction.price
            };

            // update tag of car from auctions collection and currentAuction
            if (auctions.find(item => item.car.plateNum === content.id)) {
              content.tag = { id: 2, type: 'primary', color: 'grey', msg: '竞价已结束' };
            } else if (global.currentAuction && global.currentAuction.car && global.currentAuction.car.plateNum === content.id) {
              content.tag = { id: 1, type: 'danger', color: 'red', msg: '正在竞价中' };
            }

            cars.push(content);
          });
      });
    res.json({ code: 1, msg: 'ok', cars });
  });

  router.get('/update-userinfo', async function (req, res, next) {
    let { sid, userInfo } = req.query;
    userInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
    await updateUserInfo(sid, userInfo);
    res.json({ errcode: 0, msg: 'ok' });
  });

  router.get('/update-userphone', async function (req, res, next) {
    try {
      let { sid, encryptedData, iv } = req.query;
      const sessionKey = (await global.db.collection('sessions').findOne({ sid })).session_key;
      assert.notEqual(null, sessionKey);
      const pc = new WXBizDataCrypt(AppID, sessionKey);
      const data = pc.decryptData(encryptedData, iv);
      console.log('解密后 data: ', data);
      // 解密后的 userInfo 数据为
      // data = {
      //   "nickName": "Band",
      //   "gender": 1,
      //   "language": "zh_CN",
      //   "city": "Guangzhou",
      //   "province": "Guangdong",
      //   "country": "CN",
      //   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
      //   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
      //   "watermark": {
      //     "timestamp": 1477314187,
      //     "appid": "wx4f4bc4dec97d474b"
      //   }
      // }

      // 解密后的 userphoneNumber 数据为
      // {
      //   "phoneNumber": "13580006666",
      //   "purePhoneNumber": "13580006666",
      //   "countryCode": "86",
      //   "watermark": {
      //     "appid":"APPID",
      //     "timestamp": TIMESTAMP
      //   }
      // }
      await updateUserPhone(sid, data.phoneNumber);
      res.json({ errcode: 0, msg: 'ok' });
    } catch (error) {
      console.log('update-userphone error: ', error);
    }
  });

  router.get('/enroll', function (req, res, next) {
    const { sid, nickName, mobile } = req.query;
    sid2openid(sid)
      .then(openid => global.db.collection('users').updateOne({ openid }, { $set: { mobile, 'userInfo.nickName': nickName } }, { upsert: true }))
      .then(() => res.json({ code: 1, msg: 'success' }))
      .catch(err => console.log(err));
  });

  router.get('/get-userphone', async function (req, res, next) {
    const { sid } = req.query;
    const openid = await sid2openid(sid);
    const user = await global.db.collection('users').findOne({ openid });
    res.json({ errcode: 0, msg: 'ok', content: user && user.mobile });
  });

  // app version auto update
  router.get('/app_version', function (req, res, next) {
    //console.log('app_version/req.query: ', req.query);
    const { version, type } = req.query;
    /* res的数据说明
     * | 参数名称	     | 一定返回 	| 类型	    | 描述
     * | -------------|--------- | --------- | ------------- |
     * | versionCode	 | y	    | int	    | 版本号        |
     * | versionName	 | y	    | String	| 版本名称      |
     * | versionInfo	 | y	    | String	| 版本信息      |
     * | forceUpdate	 | y	    | boolean	| 是否强制更新  |
     * | downloadUrl	 | y	    | String	| 版本下载链接  |
     */
    let content = null;
    if (version != '004') {
      content = {
        success: true,
        versionCode: 4,
        versionName: '0.0.4',
        versionInfo: '公测版',
        forceUpdate: true,
        downloadUrl: 'https://www.all2key.cn/yzauction-qrcode/yzauction_004.wgt'
      };
    }
    console.log('res.json({ content: %s })', content);
    res.json(content);
  });

  // modify stages for temp
  router.get('/modify-stages', function (req, res, next) {
    const col = global.db.collection('stages');
    const { start_time } = req.query;
    col
      .updateOne({ state: 1 }, { $set: { start_time } }, { upsert: false })
      .then(r => {
        global.obj_tasks.exec('manual modify stages start_time!');
        res.json(r);
      })
      .catch(err => console.log(err));

    function removeCar(car = '云A00005') {
      let count = 0;
      col
        .find()
        .toArray()
        .then(stages => {
          stages.forEach(stage => {
            const newAucs = [];
            stage.auctions.forEach(auc => {
              if (auc.car.plateNum !== car) {
                newAucs.push(auc);
              }
            });
            col
              .updateOne({ id: stage.id }, { $set: { auctions: newAucs } }, { upsert: false })
              .then(() => count++)
              .catch(err => console.log(err));
          });
        })
        .catch(err => console.log(err));
      res.json({ count });
    }
  });

  router.get('/get-isolatecars', async function (req, res, next) {
    const cars = await global.db.collection('cars').find({ stageid: '' }).toArray();
    res.json({ errcode: 0, msg: 'success', content: cars });
  });

  router.get('/delete-car', async function (req, res, next) {
    try {
      const { plateNum } = req.query;
      const images = await global.db.collection('images').find({ car_plat_num: plateNum }).toArray();
      images.length != 0 && images.forEach(image => deleteImage(image.filename));
      const r = await global.db.collection('cars').deleteOne({ plateNum });
      assert.equal(1, r.deletedCount);
      res.json({ errcode: 0, msg: `car: ${plateNum} deleted!` });
    } catch (error) {
      console.log(err);
    }
  });

  router.get('/unlink-car', function (req, res, next) {
    const { plateNum, stageid } = req.query;
    global.db
      .collection('stages')
      .updateOne({ id: stageid }, { $pull: { auctions: { 'car.plateNum': plateNum } } }, { upsert: false })
      .then(r => {
        //console.log(r);
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);
        res.json({ errcode: 0, msg: `car: ${plateNum} unlinked!` });
      })
      .then(r => global.db.collection('cars').updateOne({ plateNum }, { $set: { stageid: '' } }, { upsert: false }))
      .catch(err => console.log(err));
  });

  router.get('/get-online-users', async function (req, res, next) {
    try {
      const sessions = await global.db.collection('sessions').find({ online: true }).toArray();
      const openids = sessions.map(s => s.openid);
      const onlineUsers = await global.db
        .collection('users')
        .find({ openid: { $in: openids } })
        .toArray();
      const content = sessions.map(s => {
        let r = { sid: s.sid, time: s.time, nickName: '未注册', mobile: '无' };
        onlineUsers.forEach(u => {
          if (u.openid == s.openid) {
            r = { sid: s.sid, time: s.time, nickName: u.userInfo.nickName, mobile: u.mobile };
          }
        });
        return r;
      });
      res.json({ errcode: 0, msg: 'success', content });
    } catch (error) {
      console.log(error);
      res.json({ errcode: 1, msg: 'fail', content: {} });
    }
  });

  router.get('/set-prePrice', async function (req, res, next) {
    let { prePrice, carid, user } = req.query;
    if (!prePrice || !carid || !user) {
      res.json({ errcode: 0, msg: '预出价失败！', content: { user } });
      return 0;
    }

    const logger = new Logger();
    delete user._id;
    prePrice = parseInt(prePrice);
    await logger.save('addPrePrice', { prePrice, carid, user });
    const lastData = await logger.aggregate([
      { $match: { action: 'addPrePrice', 'data.carid': carid } },
      //{ $sort: { 'data.user.openid': 1, date: 1 } },
      { $sort: { date: 1 } },
      { $group: { _id: '$data.user.openid', lastData: { $last: '$data' } } },
      { $project: { prePrice: '$lastData.prePrice', user: '$lastData.user' } },
      { $sort: { prePrice: 1 } }
    ]);

    console.log({ lastData });
    const reservePrice = getMaxPrePrice(lastData);
    console.log({ reservePrice });
    
    let r = await global.db
      .collection('stages')
      .updateOne(
        { 'auctions.car.plateNum': carid, 'auctions.reserve': { $lt: reservePrice.prePrice } },
        { $set: { 'auctions.$.reserve': reservePrice.prePrice, 'auctions.$.reserveUser': reservePrice.user } },
        { upsert: false }
      );

    if (!r.matchedCount) {
      r = await global.db
        .collection('stages')
        .updateOne(
          { 'auctions.car.plateNum': carid, 'auctions.reserve': reservePrice.prePrice, 'auctions.reserveUser.openid': 'yz_auction' },
          { $set: { 'auctions.$.reserveUser': reservePrice.user } },
          { upsert: false }
        );
    }

    r.modifiedCount && global.obj_tasks.exec('set-prePrince');
    res.json({ errcode: 0, msg: '预出价成功！', content: { user } });

    function getMaxPrePrice(logs) {
      if (Array.isArray(logs) && logs.length > 0) {
        const log = logs.pop();
        if (isYz(log)) {
          return logs.pop();
        }
        return log;
        // let maxPreLog = logs.shift();
        // logs.forEach(log => {
        //   const max = parseInt(maxPreLog.lastData.prePrice);
        //   const price = parseInt(log.lastData.prePrice);
        //   if (price > max || (price === max && isYz(maxPreLog))) {
        //     maxPreLog = log;
        //   }
        // });
        // return maxPreLog.lastData;
      } else {
        return {};
      }

      function isYz(log) {
        return log.user.openid === 'yz_auction';
      }
    }

    // const r = await global.db.collection('stages').updateOne(
    //   { "auctions.car.plateNum": carid },
    //   { $max: { "auctions.$.reserve": _prePrice + 0.1 }, $push: { "auctions.$.prePriceLogs": { prePrice, user } } },
    //   { upsert: false }
    // );
  });

  router.get('/get-prePrice', function (req, res, next) {
    const { prePrice, carid, user } = req.query;
    res.json({ errcode: 0, msg: '预出价成功！', content: { user } });
  });

  return router;
};

function deleteImage(filename) {
  return new Promise(function (resolve, reject) {
    fs.unlink(global.uploadPath + filename, err => {
      if (err) reject(err);
      console.log(filename, ' was deleted');
      // remove frome db
      global.db
        .collection('images')
        .deleteOne({ filename })
        .then(r => {
          assert.equal(1, r.deletedCount);
          console.log('document was clear');
          resolve({ errcode: 0, msg: 'file deleted!' });
        })
        .catch(err => reject(err));
    });
  });
}

function midGetUserInfo() {
  return async function (req, res, next) {
    const data = req.query.data ? JSON.parse(req.query.data) : req.query;
    const sid = req.body && req.body.sid ? req.body.sid : data.sid;
    assert.notEqual(null, sid);
    req.data.user = {};
    req.data.user.openid = await sid2openid(sid);
    next();
  };
}

function randomString(length = 8) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function wait500(s = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), s);
  });
}

function updateUserInfo(sid, userInfo) {
  return sid2openid(sid).then(openid => {
    return global.db.collection('users').updateOne({ openid }, { $set: { userInfo } }, { upsert: true });
  });
}

function updateUserPhone(sid, phone) {
  return sid2openid(sid).then(openid => {
    return global.db.collection('users').updateOne({ openid }, { $set: { phone } }, { upsert: true });
  });
}

function updateUser(sid, obj = {}) {}
