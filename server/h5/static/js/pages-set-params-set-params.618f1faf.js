(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-set-params-set-params"],{"12c0":function(t,e,n){n("a4d3"),n("4de4"),n("4160"),n("e439"),n("dbb4"),n("b64b"),n("159b");var a=n("5757");function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}t.exports=o},"2e1d":function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,".all[data-v-0984fd64]{font-size:%?24?%;color:#646566;padding:%?10?%}.award[data-v-0984fd64]{height:%?80?%;color:#1989fa}.custom-button[data-v-0984fd64]{width:%?60?%;height:%?38?%;border-radius:%?10?%;background-color:#aaf;text-align:center}.myflex[data-v-0984fd64]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-align-content:space-around;align-content:space-around;margin:%?15?%;padding-top:%?10?%;padding-bottom:%?10?%;width:90%}",""]),t.exports=e},"34fd":function(t,e,n){"use strict";var a,r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"all"},[n("v-uni-view",{staticClass:"myflex"},[n("v-uni-text",{staticStyle:{flex:"2"}},[t._v("设置可抽奖次数：")]),n("van-stepper",{staticStyle:{flex:"1"},attrs:{value:t.chance,min:"0",integer:!0},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChangeChance.apply(void 0,arguments)}}})],1),n("van-button",{attrs:{plain:!0,type:"primary",block:!0},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.setChance.apply(void 0,arguments)}}},[t._v("按设置次数开始新的抽奖")]),n("van-divider",{attrs:{contentPosition:"center"}},[t._v("按百分比设置奖品概率")]),n("van-notice-bar",{attrs:{wrapable:!0,scrollable:"false","left-icon":"volume",text:"所有奖品概率总和为100，现可分配点数："+t.points}}),t._l(t.awards,(function(e,a){return n("v-uni-view",{key:a,staticClass:"myflex"},[n("v-uni-text",{staticStyle:{flex:"1"}},[t._v(t._s(e.name)+"：")]),n("van-slider",{staticStyle:{flex:"2"},attrs:{value:e.prob,"use-button-slot":!0,"bar-height":"6px","active-color":"#ee0a24",min:"0",max:"50","data-index":a,id:a},on:{drag:function(e){arguments[0]=e=t.$handleEvent(e),t.onDrag.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"custom-button",attrs:{slot:"button"},slot:"button"},[t._v(t._s(e.prob))])],1)],1)})),n("van-button",{attrs:{plain:!0,type:"primary",block:!0},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.setProbs.apply(void 0,arguments)}}},[t._v("确认奖品概率设置")])],2)},o=[];n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}))},5757:function(t,e){function n(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}t.exports=n},6150:function(t,e,n){"use strict";n.r(e);var a=n("b3a1"),r=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=r.a},8164:function(t,e,n){"use strict";var a=n("ab15"),r=n.n(a);r.a},a85d:function(t,e,n){"use strict";n.r(e);var a=n("34fd"),r=n("6150");for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);n("8164");var i,c=n("f0c5"),s=Object(c["a"])(r["default"],a["b"],a["c"],!1,null,"0984fd64",null,!1,a["a"],i);e["default"]=s.exports},ab15:function(t,e,n){var a=n("2e1d");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var r=n("4f06").default;r("c9f09a2e",a,!0,{sourceMap:!1,shadowMode:!1})},b3a1:function(t,e,n){"use strict";(function(t){var a=n("ee27");n("4160"),n("d81d"),n("e25e"),n("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=a(n("fc11")),o=n("c3f6"),i=o.request,c={data:function(){return{chance:0,probs:[3,3,21,5,22,24,21,1],points:0,awards:[{name:"挡泥板",prob:3},{name:"捷达雨伞",prob:3},{name:"车内沾灰神器",prob:21},{name:"燃油添加剂",prob:5},{name:"玻璃水",prob:22},{name:"设备换油",prob:24},{name:"车内沾灰神器",prob:21},{name:"捷达精品车模",prob:1}]}},onLoad:function(){var e=this;i("getParams",{}).then((function(n){t.log("getParams: ",n);var a=n.content.chance,r=l(e.awards,n.content.probs);e.setData({chance:a,awards:r})})).catch((function(e){return t.log(e)}))},methods:{onChangeChance:function(e){t.log(e.detail),this.setData({chance:e.detail})},setChance:function(){var e=this;uni.showModal({title:"警告！",content:"此操作会清空所有抽奖数据，请确保已下载备份之前的抽奖记录！",success:function(n){n.confirm&&i("setChance",{chance:e.chance}).then((function(e){t.log("setParams: ",e),wx.showToast({title:e.msg})})).catch((function(e){return t.log(e)}))}})},setProbs:function(){if(0!==this.points)return wx.showModal({title:"提示",content:"还有概率点数未用完！",showCancel:!1,success:function(){}}),0;var e=u(this.awards);i("setProbs",{probs:e}).then((function(e){t.log("setProbs: ",e),wx.showToast({title:e.msg})})).catch((function(e){return t.log(e)}))},onSliderChange:function(e){t.log("onSliderChange: ",e)},onDrag:function(t){var e,n=this.awards,a=parseInt(t.currentTarget.dataset.index),o=t.detail.value;n[a].prob=o;var i=s(n);i<0&&(i=0,n[a].prob=0,o=s(n)),this.setData((e={},(0,r.default)(e,"awards.".concat(a,".prob"),o),(0,r.default)(e,"points",i),e))}}};function s(t){if(!Array.isArray(t))return 0;var e=100;return t.forEach((function(t){return e-=t.prob})),e}function u(t){return Array.isArray(t)?t.map((function(t){return t.prob})):0}function l(t,e){return t.map((function(t,n){return t.prob=e[n],t}))}e.default=c}).call(this,n("5a52")["default"])},c3f6:function(t,e,n){(function(e){n("99af"),n("a15b"),n("d81d"),n("fb6a"),n("d3b7"),n("e25e"),n("25f0");var a=n("12c0");function r(t){var e=t.getFullYear(),n=t.getMonth()+1,a=t.getDate(),r=t.getHours(),i=t.getMinutes(),c=t.getSeconds();return[e,n,a].map(o).join("/")+" "+[r,i,c].map(o).join(":")}function o(t){return t=t.toString(),t[1]?t:"0"+t}function i(t){var e=/^[1]([3-9])[0-9]{9}$/;return e.test(t)?"":"号码错误！"}function c(t){for(var e=[],n=30,a=30,r=0;r<8;r++){0==r?(n=25,a=25):r<3?(n=n,a=a+166.6666+15):r<5?(a=a,n=n+150+15):r<7?(a=a-166.6666-15,n=n):r<8&&(a=a,n=n-150-15);var o=t.imageAward[r];e.push({topAward:n,leftAward:a,imageAward:o})}t.setData({awardList:e})}function s(t){for(var e=7.5,n=7.5,a=[],r=0;r<24;r++){if(0==r)n=15,e=15;else if(r<6)n=7.5,e+=102.5;else if(6==r)n=15,e=620;else if(r<12)n+=94,e=620;else if(12==r)n=565,e=620;else if(r<18)n=570,e-=102.5;else if(18==r)n=565,e=15;else{if(!(r<24))return;n-=94,e=7.5}a.push({topCircle:n,leftCircle:e})}t.setData({circleList:a}),setInterval((function(){"#FFDF2F"==t.colorCircleFirst?t.setData({colorCircleFirst:"#FE4D32",colorCircleSecond:"#FFDF2F"}):t.setData({colorCircleFirst:"#FFDF2F",colorCircleSecond:"#FE4D32"})}),500)}function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r="https://www.all2key.cn/yz/lottery/"+t,o=wx.getStorageSync("sid");return new Promise((function(t,i){uni.request({url:r,data:a({sid:o},e),header:n,success:function(e){return t(e.data)},fail:i})}))}function l(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r="https://www.all2key.cn/yz/holiday51/"+t,o=wx.getStorageSync("sid");return new Promise((function(t,i){uni.request({url:r,data:a({sid:o,appToken:"holiday51",app:"holiday51"},e),header:n,success:function(e){return t(e.data)},fail:i})}))}function f(t,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=0,o=setInterval((function(){r++;var i=r>=8?r%8:r;t.setData({indexSelect:i}),r>16&&i===a&&(clearInterval(o),u("saveAward",{finalSelect:a,key:n}).then((function(n){e.log("saveAward: ",n);var a=n.code,r=n.max;t.setData({max:r});var o=a?"恭喜您获得了"+t.awardName[parseInt(i)]+"！":"抽奖失败!";wx.showModal({title:"抽奖结果",content:o,showCancel:!1,success:function(e){e.confirm&&t.setData({isRunning:!1})}})})).catch((function(t){return e.log(t)})))}),t.times)}function d(t){var n=uni.connectSocket({url:"wss://www.all2key.cn/lottery",success:function(t){return e.log("connectSocket success: ",t)},complete:function(){}});n.onOpen((function(t){return e.log("websocket onOpen: ",t)})),n.onMessage((function(n){var a=JSON.parse(n.data);e.log("recevied msg: ",a);var r=a.mobile,o=a.award;r&&o&&t.setData({notice:"恭喜手机号为".concat(p(r),"的客户抽中奖品").concat(o,"！")})}))}function p(t){return t.slice(0,-4)+"****"}t.exports={formatTime:r,setCircleList:s,setAwardList:c,request:u,request51:l,startGame:f,webSocketConnect:d,validMobile:i}}).call(this,n("5a52")["default"])}}]);