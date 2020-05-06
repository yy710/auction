(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-upload-upload"],{"0ee6":function(e,t,a){"use strict";a.r(t);var n=a("1113"),i=a.n(n);for(var r in n)"default"!==r&&function(e){a.d(t,e,(function(){return n[e]}))}(r);t["default"]=i.a},1113:function(e,t,a){"use strict";(function(e,n,i){var r=a("ee27");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=r(a("fc11"));e["__wxRoute"]="components/cartype/cartype",n({properties:{carType:{type:Object,value:{},observer:function(e,t){this.setData({_carType:e})}},show:{type:String,value:"field"}},data:{sure:!1,_carType:{},t:{manufacturer:"厂家名称",brand:"品牌",cartype:"车型",name:"名称",yeartype:"年款",environmentalstandards:"排放标准",comfuelconsumption:"油耗",engine:"发动机",gearbox:"变速箱",drivemode:"驱动方式",carbody:"车身形式",fronttiresize:"前轮胎尺寸",reartiresize:"后轮胎尺寸",fueltype:"燃油类型",displacement:"排量(L)",fuelgrade:"燃油标号",price:"新车购置价格",frontbraketype:"前制动类型",rearbraketype:"后制动类型",parkingbraketype:"驻车制动类型",maxpower:"最大功率(KW)",sizetype:"尺寸类型",gearnum:" 档位数",geartype:"变速箱类型",seatnum:"座位数",bodystructure:"车体结构",maxhorsepower:"最大马力(Ps)"}},lifetimes:{},methods:{onConfirm:function(){this.triggerEvent("confirm",this.data._carType),this.setData({sure:!0})},onChange:function(e){i.log("onChange: ",e),this.setData((0,l.default)({},"_carType.".concat(e.target.id),e.detail))}}});var o=e["__wxComponents"]["components/cartype/cartype"];t.default=o}).call(this,a("c8ba"),a("fe07")["Component"],a("5a52")["default"])},2694:function(e,t,a){"use strict";var n,i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",["field"==e.show?a("van-cell-group",{attrs:{title:"车型信息"}},e._l(e._carType,(function(t,n){return e.t[n]?a("van-field",{key:n,attrs:{value:t,label:e.t[n],border:"false",id:n},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}}):e._e()})),1):e._e(),"cell"==e.show?a("van-cell-group",{attrs:{title:"车型信息"}},e._l(e._carType,(function(t,n){return e.t[n]?a("van-cell",{key:n,attrs:{value:t,title:e.t[n]}}):e._e()})),1):e._e(),"field"!=e.show||e.sure?e._e():a("van-button",{attrs:{type:"primary",block:!0},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.onConfirm.apply(void 0,arguments)}}},[e._v("确认以上信息正确")])],1)},r=[];a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return r})),a.d(t,"a",(function(){return n}))},"2bc2":function(e,t,a){"use strict";var n,i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[a("v-uni-view",{staticStyle:{"background-color":"#777777","line-height":"2","text-align":"center"}},[a("v-uni-text",{staticStyle:{color:"#FFFFFF","font-size":"16px",flex:"1"}},[e._v("录入二手车信息")])],1),a("van-cell-group",{attrs:{title:"行驶证信息："}},[a("van-field",{attrs:{value:e.car.plateNum,maxlength:"10",label:"车牌号码：","data-id":"plateNum"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}}),a("v-uni-view",{staticClass:"uni-list"},[a("v-uni-view",{staticClass:"uni-list-cell"},[a("v-uni-view",{staticClass:"uni-list-cell-left"},[e._v("注册日期：")]),a("v-uni-view",{staticClass:"uni-list-cell-db"},[a("v-uni-picker",{attrs:{mode:"date",value:e.date,start:e.startDate,end:e.endDate},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.bindDateChange.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"uni-input"},[e._v(e._s(e.date))])],1)],1)],1)],1),a("van-field",{attrs:{value:e.car.vin,maxlength:"20",label:"识别代号：","data-id":"vin"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}},[e.b[0]?e._e():a("van-button",{attrs:{slot:"button",size:"small",type:"primary"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.getCarType.apply(void 0,arguments)}},slot:"button"},[e._v("获取车型信息")])],1)],1),e.b[0]?a("y-cartype",{attrs:{show:"field",carType:e.carType},on:{confirm:function(t){arguments[0]=t=e.$handleEvent(t),e.onConfirm.apply(void 0,arguments)}}}):e._e(),e.b[1]?[a("van-cell-group",{attrs:{title:0==e.fileLists[0].length?"请上传外观照片":"已上传外观照片："}},[a("van-uploader",{attrs:{"data-id":"0","file-list":e.fileLists[0]},on:{"after-read":function(t){arguments[0]=t=e.$handleEvent(t),e.afterRead.apply(void 0,arguments)},delete:function(t){arguments[0]=t=e.$handleEvent(t),e.deletePhoto.apply(void 0,arguments)}}})],1),a("van-cell-group",{attrs:{title:0==e.fileLists[1].length?"请上传驾驶舱照片":"已上传驾驶舱照片："}},[a("van-uploader",{attrs:{"data-id":"1","file-list":e.fileLists[1]},on:{"after-read":function(t){arguments[0]=t=e.$handleEvent(t),e.afterRead.apply(void 0,arguments)},delete:function(t){arguments[0]=t=e.$handleEvent(t),e.deletePhoto.apply(void 0,arguments)}}})],1),a("van-cell-group",{attrs:{title:0==e.fileLists[2].length?"请上传发动机舱照片":"已上传发动机舱照片："}},[a("van-uploader",{attrs:{"data-id":"2","file-list":e.fileLists[2]},on:{"after-read":function(t){arguments[0]=t=e.$handleEvent(t),e.afterRead.apply(void 0,arguments)},delete:function(t){arguments[0]=t=e.$handleEvent(t),e.deletePhoto.apply(void 0,arguments)}}})],1)]:e._e(),e.b[2]?a("van-cell-group",{attrs:{title:"车辆展示信息："}},[a("van-field",{attrs:{value:e.car.carTitle,maxlength:"20",label:"描述标题：",placeholder:"请输入车辆描述标题","data-id":"carTitle",required:!0},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}}),a("van-field",{attrs:{value:e.car.mileage,maxlength:"10",label:"行驶里程：",type:"number",placeholder:"请输入车辆行驶里程（公里）","data-id":"mileage",required:!0},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}}),a("van-field",{attrs:{value:e.car.carDescrible,maxlength:"200",autosize:!0,type:"textarea",label:"详细描述：",placeholder:"请输入小于200字的车况描述","data-id":"carDescrible"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}})],1):e._e(),a("van-button",{attrs:{block:!0,type:"primary",disabled:!e.b[3]},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.saveCar.apply(void 0,arguments)}}},[e._v("保存以上信息")])],2)},r=[];a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return r})),a.d(t,"a",(function(){return n}))},"6c73":function(e,t,a){"use strict";a.r(t);var n=a("2bc2"),i=a("f620");for(var r in i)"default"!==r&&function(e){a.d(t,e,(function(){return i[e]}))}(r);a("a7d9");var l,o=a("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"72d0409c",null,!1,n["a"],l);t["default"]=c.exports},7181:function(e,t,a){"use strict";(function(e,n,i){var r=a("ee27");a("99af"),a("a434"),a("e25e"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=r(a("fc11")),o=r(a("b000"));e["__wxVueOptions"]={components:{"y-cartype":o.default}},e["__wxRoute"]="pages/upload/upload";var c=a("ef22"),u=c.inQyweixin,s=c.request,d=getApp(),f=d.globalData.host;function p(e){var t=new Date,a=t.getFullYear(),n=t.getMonth()+1,i=t.getDate();return"start"===e&&(a-=30),n=n>9?n:"0"+n,i=i>9?i:"0"+i,"".concat(a,"-").concat(n,"-").concat(i)}n({data:{fileLists:[[],[],[]],car:{plateNum:"云A",vehicleType:"",owner:"",addr:"",useCharacter:"",model:"",vin:"LVSHBFAF29F066713",engineNum:"",registerDate:"",carTitle:"",mileage:0,carDescrible:""},carType:{},b:[0,0,0,0],date:null,startDate:p("start"),endDate:p("end")},bindDateChange:function(e){i.log("dateChange: ",e);var t=e.target.value;this.setData({date:t,"car.registerDate":t})},onLoad:function(e){i.log("inQyweixin: ",u())},onChange:function(e){this.setData((0,l.default)({},"car.".concat(e.currentTarget.dataset.id),e.detail)),this.car.mileage&&this.setData({"b[3]":1})},afterRead:function(e){var t=this,a=e.detail.file,n=parseInt(e.target.dataset.id);i.log(a),wx.uploadFile({url:f+"/upload-photos",filePath:a.path,name:"photos",formData:{sid:d.globalData.sid,tagId:n,car_plat_num:t.data.car.plateNum},success:function(e){i.log(e.data);var a=JSON.parse(e.data),r=t.data.fileLists;r.length<n+1&&r.push([]),r[n].push({url:a.url,filename:a.filename}),t.setData({fileLists:r,"b[2]":1})}})},deletePhoto:function(e){var t=this,a=e.detail.index,n=parseInt(e.target.dataset.id);i.log("index: ",a," id: ",n),wx.request({url:f+"/delete-photo",data:{filename:t.data.fileLists[n][a].filename},success:function(e){i.log(e.data);var r=t.data.fileLists[n];r.splice(a,1),t.setData((0,l.default)({},"fileLists[".concat(n,"]"),r))}})},saveCar:function(e){var t=this,a={nickName:"admin"},n={data:{car:this.data.car,carType:this.data.carType,userInfo:a}};s("/save-car",n).then((function(e){i.log("save-car: ",e.data);var a="../auctions/auctions?carid="+t.data.car.plateNum;uni.reLaunch({url:a})})).catch((function(e){return i.log(e)}))},getCarType:function(){var e=this,t=e.car.vin;s("/vin",{vin:t}).then((function(t){i.log("/vin: ",t.data);var a=t.data.carType;e.setData({carType:a,"b[0]":1})})).catch((function(e){return i.log(e)}))},onConfirm:function(e){this.setData({carType:e.detail,"car.carTitle":e.detail.name,"b[1]":1})}});var v=e["__wxComponents"]["pages/upload/upload"];t.default=v}).call(this,a("c8ba"),a("fe07")["Page"],a("5a52")["default"])},"9e5f":function(e,t,a){var n=a("ea48");"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var i=a("4f06").default;i("33d0b668",n,!0,{sourceMap:!1,shadowMode:!1})},a7d9:function(e,t,a){"use strict";var n=a("9e5f"),i=a.n(n);i.a},b000:function(e,t,a){"use strict";a.r(t);var n=a("2694"),i=a("0ee6");for(var r in i)"default"!==r&&function(e){a.d(t,e,(function(){return i[e]}))}(r);var l,o=a("f0c5"),c=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],l);t["default"]=c.exports},ea48:function(e,t,a){var n=a("24fb");t=n(!1),t.push([e.i,"/* pages/upload/upload.wxss */",""]),e.exports=t},f620:function(e,t,a){"use strict";a.r(t);var n=a("7181"),i=a.n(n);for(var r in n)"default"!==r&&function(e){a.d(t,e,(function(){return n[e]}))}(r);t["default"]=i.a}}]);