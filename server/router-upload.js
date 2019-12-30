const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = function (express) {
    const router = express.Router();

    router.post('/upload-photos',
        upload.array('photos'),
        function (req, res, next) {
            console.log("req.files: ", req.files);
            res.json({ msg: 'upload files ok!', url: "urlaa" });
        });

    return router;
};