const { request } = require('../../utils/util.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSale: false,
    saleC: [],
    saleFilter: "",
    isCar: false,
    carC: [],
    carType: '',
    isPaixu: false,
    paiC: [],
    paixu: '',
    cars: [],
    searchInput:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      paiC: ['默认排序', '最新发布', '价格最低', '价格最高', '最短里程'],
      saleC: ['不限', '3万以下', '3-5万', '5-10万', '10-15万', '15-20万', '20-30万', '30万以上'],
      carC: ['全部车型', '三厢轿车', '两厢轿车', 'SUV', 'MPV', '跑车', '面包车', '皮卡', '货车'],
    });
    getList(this,"");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    getList(this,"")
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeMenu(e) {
    var id = e.currentTarget.id
    if (id === 'sale') {
      this.setData({
        isSale: !this.data.isSale,
        isCar: false,
        isPaixu: false
      }, () => { console.log('sale status:', this.data.isSale) })
    } else if (id === 'car') {
      this.setData({
        isCar: !this.data.isCar,
        isSale: false,
        isPaixu: false
      }, () => { console.log('isCar status:', this.data.isCar) })
    } else if (id === 'paixu') {
      this.setData({
        isPaixu: !this.data.isPaixu,
        isCar: false,
        isSale: false
      }, () => { console.log('isPaixu status:', this.data.isPaixu) })
    }
  },
  saleSelect(e) {
    var selectValue = e.currentTarget.id
    this.setData({
      saleFilter: selectValue,
      isSale: false,
      isCar: false,
      isPaixu: false
    })
    console.log('sale select value:', selectValue)
    getListForSal(this, selectValue)
  },
  carSelect(e) {
    var selectValue = e.currentTarget.id
    this.setData({
      carType: selectValue,
      isSale: false,
      isCar: false,
      isPaixu: false
    })
    console.log('isCar select value:', selectValue)
    getListForCar(this, selectValue)
  },
  paixuSelect(e) {
    var selectValue = e.currentTarget.id
    this.setData({
      paixu: selectValue,
      isSale: false,
      isCar: false,
      isPaixu: false
    })
    console.log('isPaixu select value:', selectValue)
    getListForPai(this, selectValue)
  },
  goToDetail: function (e) {
    var carid = e.currentTarget.id
    const url = '../detail/detail?carid=' + carid;
    //wx.navigateTo({ url });
    //wx.switchTab({ url });
    wx.reLaunch({ url });
  },
  listenerSearchInput(e){
    this.data.searchInput = e.detail.value;
  },
  toSearch(){
    var values = this.data.searchInput;
    getListForSearch(this,values)
  }
});

//--------------------------------------------------------------
function getList(page, values) {
  wx.showLoading({ title: '正在获取' });
  // wx.request({
  //   url: host+'/searchlist',
  //   method: "GET",
  //   data: { carType: "", salPrice: "", paiXuType: "" },
  //   header: { "Content-Type": "application/json" },
  //   success: function (res) {
  //     wx.hideLoading(); 
  //     var code = res.data.code;
  //     if (code === 0) {
  //       console.log("content:", res.data.content);
  //       page.setData({ cars: res.data.content });
  //     } else {
  //       wx.showModal({ title: '提示', content: res.data.msg, showCancel: false});
  //     }
  //   },
  //   fail: function (e) {
  //     wx.hideLoading();
  //     wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  //   }
  // });
  request('/get-cars', {}).then(res => {
    wx.hideLoading();
    console.log("get-cars: ", res.data);
    const cars = res.data.cars;
    page.setData({ cars });
  }).catch(err => {
      wx.hideLoading();
      wx.showModal({ title: '提示', content: '网络异常，请稍后重试', showCancel: false });
  });
}

function getListForCar(page, values) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在获取',
  })
  wx.request({
    url: host+'/searchlist',
    method: "POST",
    data: {
      carType: values,
      salPrice: page.data.saleFilter,
      paiXuType: page.data.paixu,

    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading()
      var code = res.data.code
      if (code === 0) {
        console.log("content:", res.data.content)
        page.setData({
          cars: res.data.content
        }
        )

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    },
  })
}

function getListForSal(page, values) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在获取',
  })
  wx.request({
    url: host+'/searchlist',
    method: "POST",
    data: {
      salPrice: values,
      carType: page.data.carType,
      paiXuType: page.data.paixu,
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading()
      var code = res.data.code
      if (code === 0) {
        console.log("content:", res.data.content)
        page.setData({
          cars: res.data.content
        }
        )

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    },
  })
}

function getListForPai(page, values) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在获取',
  })
  wx.request({
    url: host+'/searchlist',
    method: "POST",
    data: {
      paiXuType: values,
      salPrice: page.data.saleFilter,
      carType: page.data.carType,
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading()
      var code = res.data.code
      if (code === 0) {
        console.log("content:", res.data.content)
        page.setData({
          cars: res.data.content
        }
        )

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    },
  })
}

function getListForSearch(page, values) {
  var appInstance = getApp()
  var host = appInstance.globalData.host
  wx.showLoading({
    title: '正在获取',
  })
  wx.request({
    url: host+'/searchlist',
    method: "POST",
    data: {
      carTitle: values
    },
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading()
      var code = res.data.code
      if (code === 0) {
        console.log("content:", res.data.content)
        page.setData({
          cars: res.data.content
        }
        )

      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function (e) {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '网络异常，请稍后重试',
        showCancel: false
      })
    },
  })
}