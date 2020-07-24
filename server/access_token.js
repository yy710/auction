const axios = require('axios');
const assert = require('assert');
const { corpid, secret, agentid } = global.config.workWeixin;

module.exports = {
    find() {
        return function (req, res, next) {
            if (global.token) {
                req.data.saveToken = false;
                global.config.debug && console.log("find token in global:", global.token);
                next();
            }
            else global.db.collection('tokens')
                .find({ agentid })
                .next()
                .then(doc => {
                    global.config.debug && console.log("find token in db: ", doc);
                    global.token = doc;
                    next();
                })
                .catch(err => console.log(err));
        };
    },

    checkout() {
        return function (req, res, next) {
            if (global.token) {
                const diffTime = new Date().getTime() - global.token.time;
                if (diffTime >= global.token.expires_in * 1000) {
                    console.log("token expired!");
                    global.token = null;
                }
            }
            next();
        };
    },

    getNewToken() {
        return (req, res, next) => {
            if (global.token) next();
            else {
                axios.get(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpid}&corpsecret=${secret}`)
                    .then(result => {
                        global.config.debug && console.log("axios.get(): ", result.data);
                        assert.equal(0, result.data.errcode);
                        let token = result.data;
                        token.agentid = agentid;
                        token.time = new Date().getTime();
                        global.token = token;
                        req.data.saveToken = true;
                        next();
                    }).catch(err => console.log(err));
            }
        };
    },

    saveToDb() {
        return (req, res, next) => {
            if (req.data.saveToken)
                global.db.collection('tokens').replaceOne({ agentid }, global.token, { upsert: 1 }).catch(err => console.log("saved access_token to db err: ", err));
            next();
        };
    }
};