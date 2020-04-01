const multer = require('multer');
const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const { AppID, AppSecret, JisuAppkey } = require('./config.js');
const { stages } = require('./mock');
const { sid2openid } = require('./common.js');
const WXBizDataCrypt = require('./WXBizDataCrypt');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, global.uploadPath);
  },
  filename: function(req, file, cb) {
    const suffix = file.originalname.split('.').pop();
    cb(null, randomString() + new Date().getTime() + '.' + suffix);
  }
});
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });
const crypto = require('crypto');

module.exports = function(express) {
  const router = express.Router();

  router.post(
    '/upload-photos',
    // async function
    upload.single('photos'),
    async function(req, res, next) {
      //console.log("Enter sync function...");
      const r = await wait500(10);
      //console.log("waiting...", r);
      next();
    },
    //midGetUserInfo(),
    function(req, res, next) {
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

  router.get('/delete-photo', function(req, res, next) {
    assert.notEqual(null, req.query.filename);
    const filename = req.query.filename;
    fs.unlink(global.uploadPath + filename, err => {
      if (err) throw err;
      console.log(filename, ' was deleted');
      // remove frome db
      const col = global.db.collection('images');
      col
        .deleteOne({ filename })
        .then(r => {
          assert.equal(1, r.deletedCount);
          console.log('document was clear');
          res.json({ errcode: 0, msg: 'file deleted!' });
        })
        .catch(err => console.log(err));
    });
  });

  router.get('/get-stage', async function(req, res, next) {
    const carid = req.query.carid;
    // find stage from carid
    const stage = await global.db.collection('stages').findOne({ 'auctions.car.plateNum': carid });
    const auction = stage.auctions.find(item => item.car.plateNum == carid);
    const { registerDate, carTitle, mileage, carType, images, carDescrible } = auction.car;
    delete carType.carlist;
    const content = {
      stageStartTime: stage.start_time,
      stageState: stage.state,
      stageId: stage.id,
      startPrice: auction.price / 10000,
      reservePrice: auction.reserve,
      auctionState: auction.state,
      carInfo: { registerDate, carTitle, mileage, carDescrible },
      carType,
      imageURLs: images.map(item => `https://www.all2key.cn/yz/auction/images/${item.filename}`)
    };
    res.json({ code: 0, msg: 'ok', content });
  });

  router.get('/get-car', async function(req, res, next) {
    const plateNum = req.query.carid;
    const car = await global.db.collection('cars').findOne({ plateNum });
    res.json({ code: 0, msg: 'ok', car });
  });

  router.get('/login', async function(req, res, next) {
    const { code } = req.query;
    assert.notEqual(null, code);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
    try {
      const session = (await axios.get(url)).data;
      //console.log("jscode2session: ", session);
      // res: { session_key: 'zqzM4lY5QMtAWOGQaFBEig==', openid: 'o9Y585eAFqkm6WrDO6nEKmHIeqMc' }
      session.sid = createSid(session);
      console.log('create session: ', session);
      await global.db.collection('sessions').replaceOne({ openid: session.openid }, session, { upsert: true });
      res.json({ msg: 'successs!', sid: session.sid });
    } catch (error) {
      console.log('login error', error);
    }

    function createSid(data, hash = crypto.createHash('md5')) {
      hash.update(JSON.stringify(data, null, 2));
      return hash.digest('hex').slice(-12);
    }
  });

  router.get('/vin', async function(req, res, next) {
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

  router.get('/check-session', function(req, res, next) {
    assert.notEqual(null, req.query.sid);
    const sid = req.query.sid;
    global.db
      .collection('sessions')
      .findOne({ sid })
      .then(r => {
        res.json({ code: !!r });
      })
      .catch(err => console.log(err));
  });

  router.get('/save-car', async function(req, res, next) {
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
    const images = await global.db
      .collection('images')
      .find({ car_plat_num: plateNum })
      .toArray();
    const car = { ...data.car, carType, images };
    try {
      await global.db.collection('cars').replaceOne({ plateNum }, car, { upsert: true });
      res.json({ msg: 'ok', errcode: 0 });
    } catch (error) {
      console.log(error);
      res.json({ msg: 'opreate db error!', errcode: 1 });
    }
  });

  router.get('/get-stages', function(req, res, next) {
    const col = global.db.collection('stages');
    col
      .find({})
      .toArray()
      .then(stages => {
        //console.log("get-stages: ", stages);
        res.json({ msg: 'ok', stages });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-mycar', async function(req, res, next) {
    const { sid } = req.query;
    assert.notEqual(null, sid);
    const openid = await sid2openid(sid);
    console.log('get-mycar openid: ', openid);
    const mycars = await global.db
      .collection('auctions')
      .find({ 'buyer.openid': openid })
      .toArray();
    //console.log('mycars: ', mycars);
    const content = mycars.map(item => {
      return {
        plateNum: item.car.plateNum,
        price: item.price,
        title: item.car.carTitle,
        imageURL: 'https://www.all2key.cn/yz/auction/images/' + item.car.images[0].filename
      };
    });
    res.json({ msg: 'ok', content });
  });

  router.get('/get-history', function(req, res, next) {
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
              desc: `${log.data.user.userInfo.nickName}出价: ¥${addNum} + ¥${price} = ¥${parseInt(price) +
                parseInt(addNum)}`
            };
          });
        res.json({ msg: 'ok', content });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-auctions', function(req, res, next) {
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
            endPrice: auction.price,
            reservePrice: auction.reserve,
            //logs: auction.logs,
            tag: auction.state === 2 ? '已成交' : '流拍',
            buyer: auction.buyer.userInfo
          };
        });
        res.json({ msg: 'ok', content });
      })
      .catch(err => console.log(err));
  });

  router.get('/update-stage-start-time', function(req, res, next) {
    console.log('req.query: ', req.query);

    let { id, start_time } = req.query;
    id = parseInt(id);
    global.db
      .collection('stages')
      .updateOne({ id }, { $set: { start_time } })
      .then(() => res.json({ msg: 'ok' }))
      .catch(err => console.log(err));
  });

  router.get('/save-stage', async function(req, res, next) {
    console.log('save-stage query: ', req.query);
    const { stageid, startPrice, reservePrice, platNum } = req.query;
    const auction = {
      state: 0,
      price: startPrice,
      reserve: reservePrice,
      car: await global.db.collection('cars').findOne({ plateNum: platNum })
    };
    console.log('save-stage/auction: ', auction);
    global.db
      .collection('stages')
      .updateOne({ id: parseInt(stageid) }, { $push: { auctions: auction } })
      .then(r => {
        res.json({ msg: 'ok' });
      })
      .catch(err => console.log(err));
  });

  router.get('/add-stage', function(req, res, next) {
    const newStage = JSON.parse(req.query.newStage);
    if (req.data.apptoken) newStage.apptoken = req.data.apptoken;
    stages.push(newStage);
    // save to db
    const col = global.db.collection('stages');
    col
      .replaceOne({ id: newStage.id }, newStage, { upsert: true })
      .then(r => {
        res.json({ msg: 'ok' });
      })
      .catch(err => console.log(err));
  });

  router.get('/get-cars', async function(req, res, next) {
    const cars = [];
    const auctions = await global.db
      .collection('auctions')
      .find()
      .toArray();
    const stages = await global.db
      .collection('stages')
      .find({ state: { $in: [0, 1, 2] } })
      .toArray();
    stages.forEach(stage => {
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

        if (auctions.find(item => item.car.plateNum === content.id)) {
          content.tag = { id: 2, type: 'primary', color: 'grey', msg: '竞价已结束' };
        } else if (
          global.currentAuction &&
          global.currentAuction.car &&
          global.currentAuction.car.plateNum === content.id
        ) {
          content.tag = { id: 1, type: 'danger', color: 'red', msg: '正在竞价中' };
        }

        cars.push(content);
      });
    });
    res.json({ msg: 'ok', cars });
  });

  router.get('/update-userinfo', async function(req, res, next) {
    let { sid, userInfo } = req.query;
    userInfo = typeof userInfo === 'string' ? JSON.parse(userInfo) : userInfo;
    await updateUserInfo(sid, userInfo);
    res.json({ errcode: 0, msg: 'ok' });
  });

  router.get('/update-userphone', async function(req, res, next) {
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

  router.get('/get-userphone', async function(req, res, next) {
    const { sid } = req.query;
    const openid = await sid2openid(sid);
    const user = await global.db.collection('users').findOne({ openid });
    res.json({ errcode: 0, msg: 'ok', content: user.phone });
  });

  return router;
};

function midGetUserInfo() {
  return async function(req, res, next) {
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
  return new Promise(function(resolve, reject) {
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
