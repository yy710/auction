const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
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
        upload.single('photos'),
        function (req, res, next) {
            console.log("req.file: ", req.file);
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
            const url = 'https://www.all2key.cn/yz/auction/images/' + req.file.filename;
            res.json({ msg: 'upload files ok!', url });
        });

    return router;
};

function randomString(length = 8) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
