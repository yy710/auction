const request = _request('https://www.all2key.cn/yz/auction', 'yz_auction');

const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

function inQyweixin() {
  try {
    const res = wx.getSystemInfoSync(); //console.log("wx.getSystemInfoSync: ", res);

    if (res.environment) {
      //console.log("run in qyweixin!");
      return true;
    }

    return false;
  } catch (e) {
    console.log("wx.getSystenInfoSync() error: ", e);
  }
}

function _request(host, apptoken) {
  /**
   * @param {string} action
   * @param {object} data
   * @return {promise}
   */
  return function(action, data = {}, header = {}) {
    return new Promise(function(resolve, reject) {
      const sid = wx.getStorageSync('sid');
      wx.request({
        url: host + action,
        header: {
          apptoken,
          ...header
        },
        data: {
          sid,
          ...data
        },
        success: resolve,
        fail: reject
      });
    });
  };
}

function validMobile(m) {
  const reg = /^[1]([3-9])[0-9]{9}$/;
  return reg.test(m) ? '' : '号码错误！';
}

function login(app) {
  app.globalData.sid = wx.getStorageSync('sid');
  console.log("get sid from storage: ", app.globalData.sid);

  if (!app.globalData.sid) {
    console.log("sid no found! aviod login()");
    _login();
  } else {
    // server login state check
    request('/check-session').then(r => {
      if (r.data.code) {
        console.log("check-session success!: ", r.data);
        app.globalData.userInfo = r.data.user;
      } else {
        console.log("check-session fail!: ", r.data);
        // refesh sid
        _login();
      }
    }).catch(err => console.log(err));
  }

  function _login() {
    request('/login', {
      code: "HBuildX"
    }).then(res => {
      console.log("login return: ", res.data);
      app.globalData.sid = res.data.sid;
      wx.setStorageSync('sid', res.data.sid);
    }).catch(err => console.log(err));
  }
}

module.exports = {
  login,
  formatTime,
  inQyweixin,
  validMobile,
  request
};
