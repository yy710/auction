<template>
	<view class="content">
		<view @tap="showPicker">选择时间:{{dateTime}}</view>
		<w-time-picker ref="picker" @confirm="onConfirm" @cancel="onCancel" :afterDays="20" :step="30"></w-time-picker>
	</view>
</template>

<script>
	import wTimePicker from "@/components/w-time-picker/w-time-picker.vue";
	export default {
		components:{
			wTimePicker
		},
		data() {
			return {
				title: 'Hello',
				dateTime:""
			}
		},
		onLoad() {

		},
		methods: {
			showPicker(){
				this.$refs.picker.show();
			},
			onConfirm(res){
				this.dateTime=res;
				console.log(res);
			},
			onCancel(){
				console.log("取消选择");
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
