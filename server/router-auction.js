const multer = require('multer');
const fs = require('fs');
const assert = require('assert');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, global.uploadPath);
    },
    filename: function (req, file, cb) {
        const suffix = file.originalname.split('.').pop();
        cb(null, randomString() + new Date().getTime() + '.' + suffix);
    }
});
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage: storage });

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
            image.creater = { id: 0, name: 'unknown', mobile: 0};
            image.create_time = new Date();
            const col = req.data.db.collection('images');
            col.insertOne(image)
                .then(() => {
                    const url = 'https://www.all2key.cn/yz/auction/images/' + req.file.filename;
                    res.json({ msg: 'upload files ok!', url, filename: req.file.filename });
                })
                .catch(err => console.log(err));
        });

    router.get('/delete-photo', function (req, res, next) {
        assert.notEqual(null, req.query.filename);
        const filename = req.query.filename;
        fs.unlink('uploads/' + filename, (err) => {
            if (err) throw err;
            console.log(filename, ' was deleted');
            res.json({ errcode: 0, msg: "file deleted!" });
        });
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