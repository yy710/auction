# APP版本更新、强制更新、漂亮的更新界面

### QQ交流群(学习干货多多) 607391225
![QQ交流群](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)

### 第一步配置APP更新接口
在`APPUpdate.js`里面`getServerNo`函数方法配置更新接口
```
let httpData = {
	version:version
};
if (platform == "android") {
	httpData.type = 1101;
} else {
	httpData.type = 1102;
}
/* 接口入参说明
 * version: 应用当前版本号（已自动获取）
 * type：平台（1101是安卓，1102是IOS）
 */ 
$http.get("api/kemean/aid/app_version", httpData).then(res => {
	/*接口出参说明 （res数据说明）
	* | 参数名称	     | 一定返回 	| 类型	    | 描述
	* | -------------|--------- | --------- | ------------- |
	* | versionCode	 | y	    | int	    | 版本号        |
	* | versionName	 | y	    | String	| 版本名称      |
	* | versionInfo	 | y	    | String	| 版本信息      |
	* | forceUpdate	 | y	    | boolean	| 是否强制更新  |
	* | downloadUrl	 | y	    | String	| 版本下载链接  |
	*/
});
```

### 第二步 使用方法
``` 
// App.vue页面

// #ifdef APP-PLUS
import APPUpdate from "@/utils/APPUpdate";
// #endif

onLaunch: function(e) {
	// #ifdef APP-PLUS
	APPUpdate();
	// #endif
}
```

### 修改弹窗的主题色或弹窗图标
在`APPUpdate.js`里面上面`$mainColor`常量中定义主题颜色，`$iconUrl`常量中定义图标地址

### 检查APP是否有新版本（一般在设置页面使用）
```
// #ifdef APP-PLUS
import APPUpdate, { getCurrentNo } from "@/utils/APPUpdate";
// #endif
export default {
	data() {
		return {
			version: "" // 版本号
		};
	},
	//第一次加载
	onLoad(e) {
		// #ifdef APP-PLUS
		getCurrentNo(res => {
			// 进页面获取当前APP版本号（用于页面显示）
			this.version = res.version;
		});
		// #endif
	},
	//方法
	methods: {
		// 检查APP是否有新版本
		onAPPUpdate() {
			// true 没有新版本的时候有提示，默认：false
			APPUpdate(true);
		}
	}
}
```