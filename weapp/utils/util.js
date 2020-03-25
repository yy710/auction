const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function inQyweixin(){
  try {
    const res = wx.getSystemInfoSync();
    //console.log("wx.getSystemInfoSync: ", res);
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
  return function(action, data = {}, header = {}){
    return new Promise(function (resolve, reject){
      const sid = wx.getStorageSync('sid');
      wx.request({
        url: host + action,
        header: { apptoken, ...header },
        data: { sid, ...data },
        success: resolve,
        fail: reject
      });
    });
  };
}

module.exports = {
  formatTime,
  inQyweixin,
  request: _request('https://www.all2key.cn/yz/auction', 'yz_auction')
}
