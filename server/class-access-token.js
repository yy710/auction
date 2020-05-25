const axios = require('axios');

class AccessToken {
  constructor(config, col = global.db.collection('tokens')) {
    this.config = config;
    this.col = col;
    this.token = global.token;
    this.saveToken = false;
  }

  async getToken() {
    return (await (await this.findToken()).checkoutToken().createToken()).saveToDb();
  }

  async findToken() {
    if (!this.token) {
      this.token = await this.col.findOne({ agentid: this.config.agentid });
      global.debug && this.token && console.log('find token in db: ', this.token);
    } else {
      global.debug && console.log('find token:', this.token);
    }
    return this;
  }

  checkoutToken() {
    if (this.token) {
      const diffTime = new Date().getTime() - this.token.time;
      if (diffTime >= this.token.expires_in * 1000) {
        console.log('token expired!');
        this.token = null;
      }
    }
    return this;
  }

  async createToken() {
    if(this.token)return this;
    const result = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.config.corpid}&corpsecret=${this.config.secret}`
    );
    const token = result.data;
    global.debug && console.log('axios.get().data: ', token);
    token.agentid = this.config.agentid;
    token.time = new Date().getTime();
    this.token = token;
    this.saveToken = true;
    return this;
  }

  saveToDb() {
    if (this.saveToken) {
      this.col.replaceOne({ agentid: this.config.agentid }, this.token, { upsert: 1 });
    }
    global.token = this.token;
    return this; 
  }
}

module.exports = AccessToken;