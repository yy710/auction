const XLSX = require('xlsx');
//const MAX = 10;

module.exports = function (express) {
  const col = global.db.collection('holiday613_sessions');
  const colParams = global.db.collection('params');
  const router = express.Router();

  router.use(async function (req, res, next) {
    const { sid } = req.query;
    try {
      req.query.user = await col.findOne({ sid });
      req.data = {};
      req.data.params = await global.db.collection('params').findOne({ app: 'holiday613' });
      //console.log('params: ', req.data);
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
        nickName,
        awards: (user && user.awards) || []
      };
      try {
        await col.replaceOne({ mobile }, session, { upsert: true });
      } catch (error) {
        console.log(error);
      }
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
      .findOne({ app: 'holiday613' })
      .then((r) => {
        res.json({ code: 1, msg: 'success', content: r });
      })
      .catch((err) => console.log(err));
  });

  router.get('/setChance', function (req, res, next) {
    const { chance } = req.query;
    const gifts = resetAmount(req.data.params.gifts);
    colParams
      .updateOne({ app: 'holiday613' }, { $set: { chance, gifts } }, { upsert: false })
      .then(() => col.deleteMany({}))
      .then(() => {
        res.json({ code: 1, msg: '设置成功！' });
      })
      .catch((err) => console.log(err));

    function resetAmount(gifts) {
      return gifts.map((gift) => {
        gift.amount = gift.initAmount;
        return gift;
      });
    }
  });

  router.get('/setProbs', function (req, res, next) {
    const probs = req.query.probs.split(',');
    global.db
      .collection('params')
      .updateOne({ app: 'holiday613' }, { $set: { probs } }, { upsert: true })
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
        res.json({ code: 1, msg: '已超过抽奖次数限制!' });
        return 0;
      }
      const _gifts = [
        { name: '精美茶具', initAmount: 8, amount: 8, id: '1', index: 0, images: [''], describe: '精美茶具' },
        { name: '时尚灭蚊灯', initAmount: 18, amount: 18, id: '2', index: 1, images: [''], describe: '时尚灭蚊灯' },
        { name: '网红包', initAmount: 20, amount: 20, id: '3', index: 2, images: [''], describe: '网红包' },
        { name: '优质大米', initAmount: 15, amount: 15, id: '4', index: 3, images: [''], describe: '优质大米' },
        { name: '食用调和油', initAmount: 4, amount: 4, id: '5', index: 4, images: [''], describe: '食用调和油' },
        { name: '伞', initAmount: 50, amount: 50, id: '6', index: 5, images: [''], describe: '伞' },
        { name: '网红包', initAmount: 20, amount: 20, id: '7', index: 6, images: [''], describe: '网红包' },
        { name: '网红包', initAmount: 20, amount: 20, id: '8', index: 7, images: [''], describe: '网红包' },
        { name: '饮料杯', initAmount: 12, amount: 12, id: '9', index: 8, images: [''], describe: '饮料杯' },
        { name: '紫砂炖锅', initAmount: 0, amount: 0, id: '10', index: 9, images: [''], describe: '紫砂炖锅' },
        { name: '车用手机支架', initAmount: 29, amount: 29, id: '11', index: 10, images: [''], describe: '车用手机支架' },
        { name: '工具箱', initAmount: 5, amount: 5, id: '12', index: 11, images: [''], describe: '工具箱' },
        { name: '网红包', initAmount: 20, amount: 20, id: '13', index: 12, images: [''], describe: '网红包' },
        { name: '网红包', initAmount: 20, amount: 20, id: '14', index: 13, images: [''], describe: '网红包' },
        { name: '电烤箱', initAmount: 0, amount: 0, id: '15', index: 14, images: [''], describe: '多功能电烤箱' },
        { name: '韩式电烤盘', initAmount: 0, amount: 0, id: '16', index: 15, images: [''], describe: '韩式电烤盘' },
        { name: '日月神锅', initAmount: 0, amount: 0, id: '17', index: 16, images: [''], describe: '涮烤一体日月神锅' },
        { name: '网红包', initAmount: 10, amount: 10, id: '18', index: 17, images: [''], describe: '网红包' },
        { name: '电炖锅', initAmount: 0, amount: 0, id: '19', index: 18, images: [''], describe: '电炖锅' },
        { name: '网红包', initAmount: 10, amount: 10, id: '20', index: 19, images: [''], describe: '网红包' },
        { name: '缤纷饮品', initAmount: 8, amount: 8, id: '21', index: 20, images: [''], describe: '缤纷饮品' }
      ];
      const gifts = req.data.params.gifts || _gifts;
      const stuff = createStuff(gifts);
      const finalSelect = getSelect(stuff);
      const key = randomString();
      await col.updateOne({ sid: user.sid }, { $set: { key, finalSelect } }, { upsert: false });
      res.json({ code: 0, msg: 'success', finalSelect, key, gift: gifts[finalSelect] });
    } else {
      res.json({ code: 2, msg: '未授权用户！' });
    }
  });

  router.get('/saveAward', async function (req, res, next) {
    const MAX = parseInt(req.data.params.chance);
    const gifts = req.data.params.gifts;
    const { sid, key, finalSelect, user } = req.query;
    if (user && finalSelect) {
      const gift = gifts.find((g) => g.index == finalSelect);
      const data = { time: new Date().getTime(), index: finalSelect, gift };
      try {
        if (user.key != key || user.finalSelect != finalSelect) {
          console.log('has hacker!!!');
          return 0;
        }
        //console.log(data);
        await col.updateOne({ sid }, { $push: { awards: data } }, { upsert: false });
        await colParams.updateOne(
          { app: 'holiday613', 'gifts.index': parseInt(finalSelect) },
          { $inc: { 'gifts.$.amount': -1 } },
          { upsert: false }
        );
        const max = user.awards ? MAX - user.awards.length - 1 : MAX - 1;
        res.json({ code: 1, msg: '抽奖成功', max, award: gift.describe });
        global.wss3.broadcast({ mobile: hideMobile(user.mobile), award: gift.describe });
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
            奖品列表: Array.isArray(s.awards) ? array2string(s.awards) : ''
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
            str += item.gift.describe;
            if (index < arr.length - 1) str += ',';
          });
          return str;
        }
      })
      .catch((err) => console.log(err));
    //res.json({msg: "ok!"});
  });

  router.get('/static', async function (req, res, next) {
    const { gifts } = req.data.params;
    // { name: '发动机氢氧除积碳', amount: 10, id: '1', index: 3, images: [''], describe: '发动机氢氧除积碳（价值380元）' },
    res.json({ code: 1, msg: 'success', content: gifts });
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

function getSelect(stuff) {
  //console.log('stuff: ', stuff);
  if (stuff.length === 0) return 11;

  //const index = Math.round(Math.random() * stuff.length);
  const index = Math.floor(Math.random() * stuff.length);
  return stuff[index];
}

function createStuff(gifts) {
  if (!Array.isArray(gifts)) throw error;
  const stuff = [];
  gifts.forEach((gift, index) => {
    for (let i = 0; i < gift.amount; i++) {
      stuff.push(gift.index);
    }
  });
  return stuff;
}
