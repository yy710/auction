(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"12c0":function(t,e,n){n("a4d3"),n("4de4"),n("4160"),n("e439"),n("dbb4"),n("b64b"),n("159b");var a=n("5757");function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}t.exports=c},"2b95":function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,".all[data-v-4aca08c3]{font-size:%?24?%;color:#646566;padding:%?10?%}.award[data-v-4aca08c3]{height:%?80?%;color:#1989fa}.custom-button[data-v-4aca08c3]{width:%?60?%;height:%?38?%;border-radius:%?10?%;background-color:#aaf;text-align:center}.myflex[data-v-4aca08c3]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-align-content:space-around;align-content:space-around;margin:%?15?%;padding-top:%?10?%;padding-bottom:%?10?%;width:90%}",""]),t.exports=e},4313:function(t,e,n){"use strict";var a=n("b69f"),r=n.n(a);r.a},5757:function(t,e){function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}t.exports=n},6322:function(t,e,n){"use strict";n.r(e);var a=n("de19"),r=n("a971");for(var c in r)"default"!==c&&function(t){n.d(e,t,(function(){return r[t]}))}(c);n("4313");var o,i=n("f0c5"),s=Object(i["a"])(r["default"],a["b"],a["c"],!1,null,"4aca08c3",null,!1,a["a"],o);e["default"]=s.exports},"85e8":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n("c3f6"),r=a.request51,c={data:function(){return{chance:0}},onLoad:function(){var e=this;r("getParams",{}).then((function(n){t.log("getParams: ",n);var a=n.content.chance;e.setData({chance:a})})).catch((function(e){return t.log(e)}))},methods:{onChangeChance:function(e){t.log(e.detail),this.setData({chance:e.detail})},setChance:function(){var e=this;uni.showModal({title:"警告！",content:"此操作会清空所有抽奖数据，请确保已下载备份之前的抽奖记录！",success:function(n){n.confirm&&r("setChance",{chance:e.chance}).then((function(e){t.log("setParams: ",e),wx.showToast({title:e.msg})})).catch((function(e){return t.log(e)}))}})}}};e.default=c}).call(this,n("5a52")["default"])},a971:function(t,e,n){"use strict";n.r(e);var a=n("85e8"),r=n.n(a);for(var c in a)"default"!==c&&function(t){n.d(e,t,(function(){return a[t]}))}(c);e["default"]=r.a},b69f:function(t,e,n){var a=n("2b95");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var r=n("4f06").default;r("14934f63",a,!0,{sourceMap:!1,shadowMode:!1})},c3f6:function(t,e,n){(function(e){n("99af"),n("a15b"),n("d81d"),n("fb6a"),n("d3b7"),n("e25e"),n("25f0");var a=n("12c0");function r(t){var e=t.getFullYear(),n=t.getMonth()+1,a=t.getDate(),r=t.getHours(),o=t.getMinutes(),i=t.getSeconds();return[e,n,a].map(c).join("/")+" "+[r,o,i].map(c).join(":")}function c(t){return t=t.toString(),t[1]?t:"0"+t}function o(t){var e=/^[1]([3-9])[0-9]{9}$/;return e.test(t)?"":"号码错误！"}function i(t){for(var e=[],n=30,a=30,r=0;r<8;r++){0==r?(n=25,a=25):r<3?(n=n,a=a+166.6666+15):r<5?(a=a,n=n+150+15):r<7?(a=a-166.6666-15,n=n):r<8&&(a=a,n=n-150-15);var c=t.imageAward[r];e.push({topAward:n,leftAward:a,imageAward:c})}t.setData({awardList:e})}function s(t){for(var e=7.5,n=7.5,a=[],r=0;r<24;r++){if(0==r)n=15,e=15;else if(r<6)n=7.5,e+=102.5;else if(6==r)n=15,e=620;else if(r<12)n+=94,e=620;else if(12==r)n=565,e=620;else if(r<18)n=570,e-=102.5;else if(18==r)n=565,e=15;else{if(!(r<24))return;n-=94,e=7.5}a.push({topCircle:n,leftCircle:e})}t.setData({circleList:a}),setInterval((function(){"#FFDF2F"==t.colorCircleFirst?t.setData({colorCircleFirst:"#FE4D32",colorCircleSecond:"#FFDF2F"}):t.setData({colorCircleFirst:"#FFDF2F",colorCircleSecond:"#FE4D32"})}),500)}function l(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r="https://www.all2key.cn/yz/lottery/"+t,c=wx.getStorageSync("sid");return new Promise((function(t,o){uni.request({url:r,data:a({sid:c},e),header:n,success:function(e){return t(e.data)},fail:o})}))}function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r="https://www.all2key.cn/yz/holiday51/"+t,c=wx.getStorageSync("sid");return new Promise((function(t,o){uni.request({url:r,data:a({sid:c,appToken:"holiday51",app:"holiday51"},e),header:n,success:function(e){return t(e.data)},fail:o})}))}function f(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=0,c=setInterval((function(){r++;var o=r>=8?r%8:r;t.setData({indexSelect:o}),r>16&&o===a&&(clearInterval(c),l("saveAward",{finalSelect:a,key:n}).then((function(n){e.log("saveAward: ",n);var a=n.code,r=n.max;t.setData({max:r});var c=a?"恭喜您获得了"+t.awardName[parseInt(o)]+"！":"抽奖失败!";wx.showModal({title:"抽奖结果",content:c,showCancel:!1,success:function(e){e.confirm&&t.setData({isRunning:!1})}})})).catch((function(t){return e.log(t)})))}),t.times)}function d(t){var n=uni.connectSocket({url:"wss://www.all2key.cn/lottery",success:function(t){return e.log("connectSocket success: ",t)},complete:function(){}});n.onOpen((function(t){return e.log("websocket onOpen: ",t)})),n.onMessage((function(n){var a=JSON.parse(n.data);e.log("recevied msg: ",a);var r=a.mobile,c=a.award;r&&c&&t.setData({notice:"恭喜手机号为".concat(v(r),"的客户抽中奖品").concat(c,"！")})}))}function v(t){return t.slice(0,-4)+"****"}t.exports={formatTime:r,setCircleList:s,setAwardList:i,request:l,request51:u,startGame:f,webSocketConnect:d,validMobile:o}}).call(this,n("5a52")["default"])},de19:function(t,e,n){"use strict";var a,r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"all"},[n("v-uni-view",{staticClass:"myflex"},[n("v-uni-text",{staticStyle:{flex:"2"}},[t._v("设置可抽奖次数：")]),n("van-stepper",{staticStyle:{flex:"1"},attrs:{value:t.chance,min:"0",integer:!0},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChangeChance.apply(void 0,arguments)}}})],1),n("van-button",{attrs:{plain:!0,type:"primary",block:!0},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.setChance.apply(void 0,arguments)}}},[t._v("按设置次数开始新的抽奖")])],1)},c=[];n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return c})),n.d(e,"a",(function(){return a}))}}]);