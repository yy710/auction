<template>
  <view>
    <van-divider contentPosition="center" v-if="!isAdmin">无管理权限！</van-divider>
    <view v-if="isAdmin">
    	<van-card v-for="car in cars" :key="car.plateNum" :desc="car.carDescrible" :title="car.carTitle" :thumb="'https://www.all2key.cn/yz/auction/images/' + car.images[0].filename">
    	  <view slot="footer">
          <van-button size="mini" @click="addToStage" :data-platenum="car.plateNum">设置竞价场次</van-button>
    	    <van-button size="mini" @click="deleteCar" :data-platenum="car.plateNum">删除</van-button>
    	  </view>
    	</van-card>
    </view>
  </view>
</template>

<script>
  const { request, auth } = require('@/utils/util.js');
  
	export default {
		data() {
			return {
        isAdmin: false,
				cars: []
			}
		},
		methods: {
      deleteCar(e){
        const plateNum = e.currentTarget.dataset.platenum;
        request('/delete-car', { plateNum }).then(res => {
          console.log(res.data);
          this.load();
        }).catch(err => console.log(err));
      },
      addToStage(e){
        const plateNum = e.currentTarget.dataset.platenum;
        uni.navigateTo({ url: '../auctions/auctions' + '?carid=' + plateNum })
      },
      load(){
        request('/get-isolatecars')
          .then(res => {
            const cars = res.data.content;
            console.log(res.data);
            this.setData({ cars });
          })
          .catch(err => console.log(err));
      }
		},
    onLoad() {
      console.log('page admin-stages load!');
      auth(this).then(isAdmin => isAdmin && this.load()).catch(err => console.log(err));
    }
	}
</script>

<style>

</style>
