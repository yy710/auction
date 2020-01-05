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

module.exports = {
  formatTime,
  inQyweixin
}
