const axios = require('axios');
const assert = require('assert');
const { corpid, secret, agentid, adminId } = require('./config.js').workWeixin;

function mergeOptions(options, defaults) {
    for (var key in defaults) {
      options[key] = options[key] || defaults[key];
    }
    return options;
}

function randomString(length = 8) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
} 

class SendMsg {
    constructor(token = global.token) { 
        this.token = token;
        this.msg = {
            "touser": adminId,
            "agentid": agentid,
            "enable_id_trans": 1
        };
    }

    init(msg = {}) {
        this.msg = mergeOptions(msg, this.msg);
        return this;
    };

    toUser(user) {
        this.msg.touser = user;
        return this;
    };

    addToUser(user) {
        this.msg.touser += `|${user}`;
        return this;
    };

    sentTextcard(textcard = {}) {
        const _textcard = {
            "title": "领奖通知",
            "description": "<div class=\"gray\">2016年9月26日</div> <div class=\"normal\">恭喜你抽中iPhone 7一台，领奖码：xxxx</div><div class=\"highlight\">请于2016年10月10日前联系行政同事领取</div>",
            "url": "http://www.all2key.cn",
            "btntxt": "更多"
        };
        this.msg.msgtype = "textcard";
        this.msg.textcard = mergeOptions(textcard, _textcard);
        return this.sendMsg();
    };

    sentText(text = {}) {
        this.msg.text = this.msg.text || { "content": "你的快递已到，请携带工卡前往邮件中心领取。\n出发前可查看<a href=\"http://work.weixin.qq.com\">邮件中心视频实况</a>，聪明避开排队。" };
        this.msg.msgtype = "text";
        this.msg.text = mergeOptions(text, this.msg.text);
        return this.sendMsg();
    };

    sentTaskcard(taskcard = {}) {
        this.msg.msgtype = "taskcard";
        this.msg.taskcard = mergeOptions(taskcard, this.msg.taskcard);
        // sure a new task+id
        this.msg.taskcard.task_id = randomString(8) + this.msg.taskcard.task_id.substr(8);
        return this.sendMsg();
    };

    sendMarkdown(content = {}) {
        this.msg.msgtype = "markdown";
        this.msg.markdown = { content };
        return this.sendMsg();
    };

    sendMsg() {
        return axios
            .post(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${this.token.access_token}`, this.msg)
            .catch(error => console.log(error));
    }

    showMsg(text = '') {
        console.log(text, this.msg);
        return this;
    }
}

module.exports = SendMsg;