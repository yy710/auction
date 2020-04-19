<script>
	const { request, login } = require("./utils/util.js");

	export default {
		onLaunch: function() {
			login(this);
		},

		globalData: {
			sid: null,
			userInfo: {},
			host: 'https://www.all2key.cn/yz/auction',
			socketTask: null,
			apptoken: 'yz_auction'
		},
    
		methods: {}
	};
</script>
<style>
	@import "./app.css";
</style>
