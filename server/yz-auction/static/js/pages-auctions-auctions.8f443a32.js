(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-auctions-auctions"],{"0c68":function(t,e,a){"use strict";a.r(e);var i=a("de73"),n=a("c735");for(var r in n)"default"!==r&&function(t){a.d(e,t,(function(){return n[t]}))}(r);a("71e4");var o,s=a("f0c5"),c=Object(s["a"])(n["default"],i["b"],i["c"],!1,null,"dbad317e",null,!1,i["a"],o);e["default"]=c.exports},"659c":function(t,e,a){"use strict";var i={"w-time-picker":a("0c68").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",[a("van-cell-group",{attrs:{title:"竞价价格设置"}},[a("van-field",{attrs:{value:t.startPrice,label:"车辆起拍价",placeholder:"请输入起拍价",type:"number",border:"false","data-field":"startPrice"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChange2.apply(void 0,arguments)}}}),a("van-field",{attrs:{value:t.reservePrice,label:"车辆保留价",placeholder:"请输入保留价",type:"number",border:"false","data-field":"reservePrice"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.onChange2.apply(void 0,arguments)}}})],1),a("van-divider",{attrs:{contentPosition:"left"}},[t._v("竞价场次时间设置")]),a("v-uni-view",{staticClass:"uni-list"},[a("v-uni-radio-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.radioChange.apply(void 0,arguments)}}},t._l(t.stages,(function(e,i){return a("v-uni-label",{key:e.id,staticClass:"uni-list-cell uni-list-cell-pd"},[a("v-uni-view",[a("v-uni-radio",{attrs:{value:e.id,checked:i===t.current}})],1),a("v-uni-view",[t._v(t._s(e.dateString))])],1)})),1)],1),a("w-time-picker",{ref:"picker",on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.onConfirm.apply(void 0,arguments)},cancel:function(e){arguments[0]=e=t.$handleEvent(e),t.onCancel.apply(void 0,arguments)}}}),a("van-button",{on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.showPopup.apply(void 0,arguments)}}},[t._v("修改所选场次时间")]),a("van-button",{on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.addStage.apply(void 0,arguments)}}},[t._v("增加新的竞价场次")]),a("v-uni-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.saveStage.apply(void 0,arguments)}}},[t._v("确认竞价设置")])],1)},r=[];a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return i}))},7142:function(t,e,a){"use strict";var i=a("75ce"),n=a.n(i);n.a},"71e4":function(t,e,a){"use strict";var i=a("8f70"),n=a.n(i);n.a},7524:function(t,e,a){"use strict";(function(t,i,n){var r=a("ee27");a("7db0"),a("d81d"),a("e25e"),a("ac1f"),a("5319"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=r(a("fc11")),s=r(a("0c68"));t["__wxVueOptions"]={components:{wTimePicker:s.default}},t["__wxRoute"]="pages/auctions/auctions";var c=getApp(),d=a("ef22"),l=d.request,u=d.formatTime,f=m(v);function v(t){var e=new Date(parseInt(t));return u(e)}function m(t){return function(e){return e.map((function(e){var a=e.id,i=e.start_time,n=t(i);return{id:a,dateString:n,start_time:i}}))}}i({data:{startPrice:null,reservePrice:null,stages:[],currentStage:null,radio:"1",platNum:null,current:0},radioChange:function(t){n.log("event.detail: ",t.detail);var e=t.detail.value,a=this.stages.find((function(t){return t.id==e}));this.setData({radio:e,currentStage:a}),n.log("this.radio: ",this.radio),n.log("this.currentStage: ",this.currentStage)},onClick:function(t){n.log("onClick/name: ",t.currentTarget.dataset.name);var e=t.currentTarget.dataset.name,a=this.stages.find((function(t){return t.id==e}));this.setData({radio:e,currentStage:a}),n.log("this.radio: ",this.radio),n.log("this.currentStage: ",this.currentStage)},showPopup:function(){var t=this.currentStage.dateString;n.log("currentDate: ",t),this.setData({currentDate:t}),this.$refs.picker.show()},onClose:function(){this.setData({showPop:!1})},onInput:function(t){n.log("onInput(): ",t)},onConfirm:function(t){var e=this;n.log("onConfirm/e: ",t);var a=new Date(t.replace(/\-/g,"/")).getTime(),i=this.currentStage;i.start_time=a,delete i.dateString,n.log("currentStage: ",i),wx.request({url:c.globalData.host+"/update-stage-start-time",data:i,success:function(t){n.log("update-stage: ",t.data),e.getStages()}})},onCancel:function(){return 0},saveStage:function(){var t={startPrice:this.startPrice,reservePrice:this.reservePrice,stageid:this.currentStage.id,platNum:this.platNum};n.log("save-stage/data: ",t),!t.platNum||!t.startPrice||!t.reservePrice||parseInt(t.startPrice)>parseInt(t.reservePrice)?uni.showModal({title:"请填写竞拍价格！",showCancel:!1,success:function(){}}):l("/save-stage",t).then((function(t){n.log("save-stage: ",t.data),uni.showModal({title:t.data.msg,showCancel:!1,success:function(){return wx.navigateTo({url:"../upload/upload"})}})})).catch((function(t){return n.log(t)}))},addStage:function(){var t=this,e={app_token:"yz_auction",start_time:(new Date).getTime()+864e5,state:0,reserve_time:120,auction_time:20,current_auction:{},auctions:[]};l("/add-stage",{newStage:e}).then((function(e){n.log("add-stage: ",e.data),t.getStages()})).catch((function(t){return n.log(t)}))},onChange2:function(t){this.setData((0,o.default)({},t.target.dataset.field,t.detail))},onChange:function(t){n.log(t)},onLoad:function(t){n.log("onLoad options: ",t),this.setData({platNum:t.carid}),this.getStages()},getStages:function(){var t=this;wx.request({url:c.globalData.host+"/get-stages",success:function(e){var a=e.data.stages||[],i=f(a),r=t.currentStage?t.currentStage:i[0]||null;n.log("new stages: ",i),n.log("currentStage: ",r),t.setData({stages:i,currentStage:r})}})}});var p=t["__wxComponents"]["pages/auctions/auctions"];e.default=p}).call(this,a("c8ba"),a("fe07")["Page"],a("5a52")["default"])},"75ce":function(t,e,a){var i=a("9546");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("443b0cb8",i,!0,{sourceMap:!1,shadowMode:!1})},"776a":function(t,e,a){"use strict";a("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=null,n={props:{afterDays:{type:[String,Number],default:7},startHour:{type:[String,Number],default:7},endHour:{type:[String,Number],default:19},step:{type:[String,Number],default:30},afterHours:{type:[String,Number],default:2},theme:{type:String,default:"#f5a200"}},data:function(){return{dayList:[],timeList:[],tabIndex:0,itemIndex:-1,showTimePicker:!1,time:""}},created:function(){i=this,i.initPicker(),i.initHours()},methods:{hide:function(){i.showTimePicker=!1,i.$emit("cancel")},show:function(){i.showTimePicker=!0},submit:function(){if(""!=i.time){var t=i.dayList[i.tabIndex],e=t.year+"-"+t.month+"-"+t.day+" "+i.time.label+":00";i.$emit("confirm",e),i.showTimePicker=!1}},toggleIndex:function(t,e){i.tabIndex=e,i.itemIndex=-1,i.initHours(!t.isToday)},toggleItem:function(t,e){t.disabled||(i.itemIndex=e,i.time=t)},forMatNumber:function(t){return t<10?"0"+t:t},initHours:function(t){var e=new Date,a=e.getHours();i.timeList=[];for(var n=1*i.startHour;n<1*i.endHour;n++)for(var r=0;r<60;r+=i.step)t?i.timeList.push({label:i.forMatNumber(n)+":"+i.forMatNumber(r),disabled:!1}):i.timeList.push({label:i.forMatNumber(n)+":"+i.forMatNumber(r),disabled:!(a+i.afterHours<n)})},initPicker:function(){var t=new Date,e=["周日","周一","周二","周三","周四","周五","周六"];i.dayList.push({year:t.getFullYear(),month:i.forMatNumber(t.getMonth()+1),day:i.forMatNumber(t.getDate()),week:e[t.getDay()],isToday:!0});for(var a=1;a<1*i.afterDays;a++)t.setDate(t.getDate()+1),i.dayList.push({year:t.getFullYear(),month:i.forMatNumber(t.getMonth()+1),day:i.forMatNumber(t.getDate()),week:e[t.getDay()],isToday:!1})}}};e.default=n},"7b02":function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.w-time-picker.show[data-v-dbad317e]{-webkit-transform:translateZ(0);transform:translateZ(0)}.w-time-picker[data-v-dbad317e]{position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;background-color:#f5f5f5;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);-webkit-transition:all .3s ease;transition:all .3s ease}.w-time-picker .w-time-days[data-v-dbad317e]{overflow:hidden;padding:%?20?% 0;background-color:#fff}.w-time-picker .w-time-days .w-time-scroll[data-v-dbad317e]{white-space:nowrap}.w-time-picker .w-time-days .w-time-day[data-v-dbad317e]{display:inline-block;width:%?120?%;text-align:center;border:solid 1px #ddd;margin:0 %?20?%;border-radius:%?6?%;padding:%?10?% 0;color:#333}.w-time-picker .w-time-days .w-time-day .w-time-week[data-v-dbad317e]{font-size:%?28?%;line-height:1}.w-time-picker .w-time-days .w-time-day .w-time-date[data-v-dbad317e]{font-size:%?24?%;line-height:1;margin-top:%?10?%}.w-time-picker .w-time-days .w-time-day-active[data-v-dbad317e]{color:red;border-color:red}.w-time-picker .w-time-body[data-v-dbad317e]{-webkit-box-flex:1;-webkit-flex:1;flex:1;overflow:hidden}.w-time-picker .w-time-body .w-time-list-scroll[data-v-dbad317e]{height:100%}.w-time-picker .w-time-body .w-time-list[data-v-dbad317e]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;padding:%?20?% %?10?%}.w-time-picker .w-time-body .w-time-item[data-v-dbad317e]{width:%?120?%;height:%?64?%;line-height:%?64?%;margin:0 %?10?% %?20?%;text-align:center;border:solid 1px #ddd;border-radius:%?6?%;font-size:%?28?%;-webkit-transition:all .3s ease;transition:all .3s ease}.w-time-picker .w-time-body .w-time-item-active[data-v-dbad317e]{background-color:#fff}.w-time-picker .w-time-footer[data-v-dbad317e]{height:%?88?%;display:-webkit-box;display:-webkit-flex;display:flex;background-color:#fff}.w-time-picker .w-time-footer .w-time-btn[data-v-dbad317e]{-webkit-box-flex:1;-webkit-flex:1;flex:1;text-align:center;line-height:%?88?%;font-size:%?30?%}.w-time-picker .w-time-footer .w-time-sure[data-v-dbad317e]{background-color:red;color:#fff}',""]),t.exports=e},"8f70":function(t,e,a){var i=a("7b02");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("2514314f",i,!0,{sourceMap:!1,shadowMode:!1})},"93e9":function(t,e,a){"use strict";a.r(e);var i=a("7524"),n=a.n(i);for(var r in i)"default"!==r&&function(t){a.d(e,t,(function(){return i[t]}))}(r);e["default"]=n.a},9546:function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,"/* pages/auctions/auctions.wxss */.test[data-v-01fcaf52]{text-align:center;padding:10px 0}uni-button[data-v-01fcaf52]{margin:%?20?%;font-size:%?28?%}",""]),t.exports=e},c735:function(t,e,a){"use strict";a.r(e);var i=a("776a"),n=a.n(i);for(var r in i)"default"!==r&&function(t){a.d(e,t,(function(){return i[t]}))}(r);e["default"]=n.a},de73:function(t,e,a){"use strict";var i,n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"w-time-picker",class:{show:t.showTimePicker}},[a("v-uni-view",{staticClass:"w-time-days"},[a("v-uni-scroll-view",{attrs:{"scroll-x":!0}},[a("v-uni-view",{staticClass:"w-time-scroll"},t._l(t.dayList,(function(e,i){return a("v-uni-view",{key:i,staticClass:"w-time-day",style:{color:t.tabIndex==i?t.theme:"#333","border-color":t.tabIndex==i?t.theme:"#ddd"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.toggleIndex(e,i)}}},[a("v-uni-view",{staticClass:"w-time-week"},[t._v(t._s(e.week))]),a("v-uni-view",{staticClass:"w-time-date"},[t._v(t._s(e.month)+"/"+t._s(e.day))])],1)})),1)],1)],1),a("v-uni-view",{staticClass:"w-time-body"},[a("v-uni-scroll-view",{staticClass:"w-time-list-scroll",attrs:{"scroll-y":!0}},[a("v-uni-view",{staticClass:"w-time-list"},t._l(t.timeList,(function(e,i){return a("v-uni-view",{key:i,staticClass:"w-time-item",class:{"w-time-item-active":!e.disabled},style:{color:t.itemIndex==i?t.theme:"#333","border-color":t.itemIndex==i?t.theme:"#ddd"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.toggleItem(e,i)}}},[t._v(t._s(e.label))])})),1)],1)],1),a("v-uni-view",{staticClass:"w-time-footer"},[a("v-uni-view",{staticClass:"w-time-cancel w-time-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.hide.apply(void 0,arguments)}}},[t._v("取消")]),a("v-uni-view",{staticClass:"w-time-sure w-time-btn",style:{"background-color":t.theme},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.submit.apply(void 0,arguments)}}},[t._v("确定")])],1)],1)},r=[];a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return i}))},f45e:function(t,e,a){"use strict";a.r(e);var i=a("659c"),n=a("93e9");for(var r in n)"default"!==r&&function(t){a.d(e,t,(function(){return n[t]}))}(r);a("7142");var o,s=a("f0c5"),c=Object(s["a"])(n["default"],i["b"],i["c"],!1,null,"01fcaf52",null,!1,i["a"],o);e["default"]=c.exports}}]);