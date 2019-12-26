const fs = require('fs');

module.exports = {
    httpsOptions: {
        key: fs.readFileSync('../../ssl/www.all2key.cn.key'),
        //ca: [fs.readFileSync('./ca/ca.crt')],
        cert: fs.readFileSync('../../ssl/www.all2key.cn.pem')
    }
};