<script>
const { request, login } = require('./utils/util.js');

export default {
  onLaunch: function() {
    login(this);
  },

  globalData: {
    sid: null,
    userInfo: {},
    host: 'https://www.all2key.cn/yz/auction',
    carid: null,
    apptoken: 'yz_auction'
  },

  methods: {}
};
</script>
<style>
@import './app.css';

/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
/* #endif*/

</style>
