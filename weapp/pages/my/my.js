Page({
  data: {
    hasUserInfo: true,
    userInfo: null,
    classics: [],
    myBooksCount: 0
  },

  onShow: function(options) {
    this.getMyFavor()
    this.hasGottenUserInfo()
    this.getMyBookCount()
  },

  getMyBookCount() {
    
  },

  hasGottenUserInfo: function() {
    wx.getSetting({
      success: (data) => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (data) => {
              this.setData({
                hasUserInfo: true,
                userInfo: data.userInfo
              })
            }
          })
        } else {
          this.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },

  onGetUserInfo: function(event) {
    let userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: userInfo
      })
    }
  },

  getMyFavor: function() {
   
  },

  onPreviewTap: function(event) {
    wx.navigateTo({
      url: '/pages/classic-detail/index?cid=' + event.detail.cid + '&type=' + event.detail.type
    })
  },
  onJumpToAbout: function(event) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  onStudy: function(event) {
    wx.navigateTo({
      url: '/pages/course/course',
    })
  },

  onShareAppMessage() {

  }
})