const multer = require('multer');
const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const { AppID, AppSecret } = require('./config.js');
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

module.exports = function (express) {
    const router = express.Router();

    router.post('/upload-photos',
        // async function
        upload.single('photos'),
        async function (req, res, next) {
            //console.log("Enter sync function...");
            const r = await wait500(10);
            //console.log("waiting...", r);
            next();
        },
        function (req, res, next) {
            console.log("req.file: ", req.file);
            console.log("req.body: ", req.body);
            /** req.files:  [ 
                { 
                  fieldname: 'photos',
                  originalname: 'wx8386f47c6190b05b.o6zAJsyw5NP-kR_Nb5jTrOXriaio.bt9vg7PFU3G73a597e77ebe1abd0ba35b674e3fa20f3.jpg',
                  encoding: '7bit',
                  mimetype: 'image/jpeg',
                  destination: 'uploads/',
                  filename: '360014f4a7d441b0e5780dced181dc46',
                  path: 'uploads/360014f4a7d441b0e5780dced181dc46',
                  size: 17407 
                } 
            ]
            */

            const image = req.file;
            delete image.originalname;
            image.creater = { id: 0, name: 'unknown', mobile: 0 };
            image.create_time = new Date();
            const col = global.db.collection('images');
            col.insertOne({ ...image, ...req.body })
                .then(() => {
                    const url = 'https://www.all2key.cn/yz/auction/images/' + req.file.filename;
                    res.json({ msg: 'upload files ok!', url, filename: req.file.filename });
                })
                .catch(err => console.log(err));
        });

    router.get('/delete-photo', function (req, res, next) {
        assert.notEqual(null, req.query.filename);
        const filename = req.query.filename;
        fs.unlink(global.uploadPath + filename, err => {
            if (err) throw err;
            console.log(filename, ' was deleted');
            // remove frome db
            const col = global.db.collection('images');
            col.deleteOne({ filename })
                .then(r => {
                    assert.equal(1, r.deletedCount);
                    console.log('document was clear');
                    res.json({ errcode: 0, msg: "file deleted!" });
                })
                .catch(err => console.log(err));
        });
    });

    router.get('/getdetail', function (req, res, next) {
        const carid = req.query.carid;
        res.json({ code: 1, msg: 'successs!', car: {} });
    });

    router.get('/login', function (req, res, next) {
        const code = req.query.code;
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
        axios.get(url).then(res => console.log("jscode2session: ", res.data)).catch(err => console.log(err));
        // res: { session_key: 'zqzM4lY5QMtAWOGQaFBEig==', openid: 'o9Y585eAFqkm6WrDO6nEKmHIeqMc' }

        res.json({ msg: 'successs!', code });
    });

    router.get('/save-car', async function (req, res, next) {
        const query = JSON.parse(req.query.data);
        console.log('query: ', query);

        // get images
        const images = await global.db.collection('images').find({ "car_plate_num": query.car.car_plate_num }).toArray();
        const cars = { ...query, images };
        console.log("cars: ", cars);
         // save to db
        await global.db.collection('cars').insertOne(cars);
        
        res.json({ msg: "ok" });
    });

    return router;
};

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