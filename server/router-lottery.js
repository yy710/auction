const XLSX = require('xlsx');
//const MAX = 10;

module.exports = function (express) {
  const col = global.db.collection('lottery_sessions');
  const router = express.Router();

  router.use(async function (req, res, next) {
    const { sid } = req.query;
    try {
      req.query.user = await col.findOne({ sid });
      req.data = { params: await global.db.collection('params').findOne({ app: 'lottery' }) };
      next();
    } catch (error) {
      console.log(error);
      res.json({ code: 0, msg: 'error' });
    }
  });

  router.get('/login', async function (req, res, next) {
    const MAX = parseInt(req.data.params.chance);
    const { sid, mobile, nickName, plateNum, user } = req.query;
    let msg = { code: 0, msg: 'login fail' };
    const max = user && user.awards ? MAX - user.awards.length : MAX;

    if (mobile) {
      const sid = randomString(12);
      const session = {
        time: new Date().getTime(),
        sid,
        mobile,
        plateNum,
        nickName
      };
      await col.replaceOne({ mobile }, session, { upsert: true });
      msg = { code: 1, msg: 'create new sid', sid, mobile: hideMobile(mobile), nickName, max };
    } else if (sid) {
      if (user && user.mobile) {
        msg = { code: 1, msg: 'found user', nickName: user.nickName, sid, mobile: hideMobile(user.mobile), max };
      } else {
        msg = { code: 1, msg: 'no mobile', max, nickName: '' };
      }
    }

    res.json(msg);
  });

  router.get('/getParams', function (req, res, next) {
    global.db
      .collection('params')
      .findOne({ app: 'lottery' })
      .then((r) => {
        res.json({ code: 1, msg: 'success', content: r });
      })
      .catch((err) => console.log(err));
  });

  router.get('/setChance', function (req, res, next) {
    const { chance } = req.query;
    global.db
      .collection('params')
      .updateOne({ app: 'lottery' }, { $set: { chance } }, { upsert: true })
      .then(() => col.deleteMany({}))
      .then(() => {
        res.json({ code: 1, msg: '设置成功！' });
      })
      .catch((err) => console.log(err));
  });

  router.get('/setProbs', function (req, res, next) {
    const probs = req.query.probs.split(',');
    global.db
      .collection('params')
      .updateOne({ app: 'lottery' }, { $set: { probs } }, { upsert: true })
      .then(() => {
        res.json({ code: 1, msg: '设置成功！' });
      })
      .catch((err) => console.log(err));
  });

  router.get('/getSelect', async function (req, res, next) {
    const MAX = parseInt(req.data.params.chance);
    const { user } = req.query;
    if (user) {
      if (user.awards && user.awards.length >= MAX) {
        res.json({ code: 0, msg: '已超过抽奖次数限制!' });
        return 0;
      }
      //声明一个数组存八个点概率, prob = [0, 100], all prob sum equil 100
      //const ProArray = [3, 3, 21, 5, 22, 24, 21, 1];
      const ProArray = getProbs(req.data.params.probs);
      const finalSelect = getSelect(ProArray);
      const key = randomString();
      await col.updateOne({ sid: user.sid }, { $set: { key, finalSelect } }, { upsert: false });
      res.json({ code: 1, msg: 'ok', finalSelect, key });
    } else {
      res.json({ code: 0, msg: '未授权用户！' });
    }
  });

  router.get('/saveAward', async function (req, res, next) {
    const MAX = parseInt(req.data.params.chance);
    const awards = [
      '挡泥板',
      '捷达雨伞',
      '车内沾灰神器',
      '燃油添加剂',
      '玻璃水',
      '设备换油',
      '车内沾灰神器',
      '捷达精品车模'
    ];
    const { sid, key, finalSelect, user } = req.query;
    if (user && finalSelect) {
      const data = { time: new Date().getTime(), index: finalSelect, name: awards[finalSelect] };
      try {
        if (user.key != key || user.finalSelect != finalSelect) {
          console.log('has hacker!!!');
          return 0;
        }
        await col.updateOne({ sid }, { $push: { awards: data } }, { upsert: false });
        const max = user.awards ? MAX - user.awards.length - 1 : MAX - 1;
        res.json({ code: 1, msg: '抽奖成功', max });
        global.wss3.broadcast({ mobile: hideMobile(user.mobile), award: awards[finalSelect] });
      } catch (error) {
        console.log('saveAward error: ', error);
        res.json({ code: 0, msg: '失败，请重试' });
      }
    } else {
      res.json({ code: 0, msg: '失败，请重试' });
    }
  });

  router.get('/download', function (req, res, next) {
    col
      .aggregate([{ $match: {} }, { $sort: { _id: -1 } }])
      .toArray()
      .then((r) => {
        const _r = r.map((s) => {
          return {
            客户昵称: s.nickName,
            客户电话: s.mobile,
            车牌号: s.plateNum,
            奖品列表: array2string(s.awards)
          };
        });
        //console.log(_r);
        //res.json({ code: 1, msg: 'success' });
        //return 0;
        // converts an array of JS objects to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(_r);
        let new_workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_workbook, worksheet, 'SheetJS');
        dl();

        function dl2(params) {
          // output format determined by filename
          const url = XLSX.writeFile(new_workbook, 'out.xlsx');
          res.download('./out.xlsx');
        }

        function dl(params) {
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          // at this point, out.xls will have been downloaded
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent('谊众客户抽奖')}.xlsx";`);
          res.end(XLSX.write(new_workbook, { type: 'buffer', bookType: 'xlsx' }));
        }

        function array2string(arr) {
          let str = '';
          arr.forEach((item, index) => {
            str += item.name;
            if (index < arr.length - 1) str += ',';
          });
          return str;
        }
      })
      .catch((err) => console.log(err));
    //res.json({msg: "ok!"});
  });

  router.get('/static', async function (req, res, next) {
    const content = await col
      .aggregate([
        { $unwind: '$awards' },
        { $project: { awards: 1 } },
        { $group: { _id: '$awards.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
      .toArray();
    // { "_id" : "捷达雨伞", "count" : 1 }
    // { "_id" : "玻璃水", "count" : 1 }
    // { "_id" : "捷达精品车模", "count" : 1 }
    res.json({ code: 1, msg: 'success', content });
  });

  return router;
};

function randomString(length = 8) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function hideMobile(m) {
  return m.slice(0, -4) + '****';
}

function getSelect(ProArray) {
  const stuff = [];
  ProArray.forEach((prob, index) => {
    for (let i = 0; i < prob; i++) {
      stuff.push(index);
    }
  });
  //console.log('stuff: ', stuff);
  const ranNumber = Math.round(Math.random() * 100);
  return stuff[ranNumber];
}

function getProbs(p){
  if(!Array.isArray(p))throw error;
  return p.map(item => parseInt(item));
}
