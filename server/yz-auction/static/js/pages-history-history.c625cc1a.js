(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-history-history"],{"108e":function(t,e,n){"use strict";var r,a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",[n("van-divider",{attrs:{contentPosition:"center"}},[t._v("保留价：¥"+t._s(t.reserve/1e4)+"万")]),n("van-steps",{attrs:{direction:"vertical",steps:t.steps,active:t.active}})],1)},s=[];n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return s})),n.d(e,"a",(function(){return r}))},6060:function(t,e,n){var r=n("63a4");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var a=n("4f06").default;a("ab7ac928",r,!0,{sourceMap:!1,shadowMode:!1})},"63a4":function(t,e,n){var r=n("24fb");e=r(!1),e.push([t.i,"/* pages/history/history.wxss */",""]),t.exports=e},b325:function(t,e,n){"use strict";n.r(e);var r=n("d515"),a=n.n(r);for(var s in r)"default"!==s&&function(t){n.d(e,t,(function(){return r[t]}))}(s);e["default"]=a.a},c76f:function(t,e,n){"use strict";var r=n("6060"),a=n.n(r);a.a},d2c9:function(t,e,n){"use strict";n.r(e);var r=n("108e"),a=n("b325");for(var s in a)"default"!==s&&function(t){n.d(e,t,(function(){return a[t]}))}(s);n("c76f");var i,o=n("f0c5"),c=Object(o["a"])(a["default"],r["b"],r["c"],!1,null,"6119b6c8",null,!1,r["a"],i);e["default"]=c.exports},d515:function(t,e,n){"use strict";(function(t,r,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,t["__wxRoute"]="pages/history/history";var s=n("ef22"),i=s.request;r({data:{steps:[],active:0,reserve:""},onLoad:function(t){var e=this;a.log("options: ",t);var n=t.carid;i("/get-history",{carid:n}).then((function(t){a.log("get-history: ",t.data);var n=t.data.content,r=t.data.reserve;e.setData({steps:n,reserve:r,active:n.length-1})})).catch((function(t){return a.log(t)}))}});var o=t["__wxComponents"]["pages/history/history"];e.default=o}).call(this,n("c8ba"),n("fe07")["Page"],n("5a52")["default"])}}]);