<template>
  <view>
    <!-- 手风琴效果 -->
    <uni-collapse accordion="true">
      <uni-collapse-item :title="stage.dateString" thumb="/static/alarm.svg"  v-for="stage in stages" :key="stage.id">
        <van-card v-for="(auc, index) in stage.auctions" :key="index" :price="auc.reserve + '（保留价）'" :desc="auc.car.plateNum" :title="auc.car.carTitle" :thumb="'https://www.all2key.cn/yz/auction/images/' + auc.car.images[0].filename">
          <view slot="footer">
            <van-button size="mini" @click="unlinkCar" :data-platenum="auc.car.plateNum" :data-stageid="stage.id">下架</van-button>
          </view>
        </van-card>
      </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script>
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
const { request, formatTime } = require('@/utils/util.js');

export default {
  components: { uniCollapse, uniCollapseItem },
  data() {
    return {
      stages: []
    };
  },
  computed: {
    getTimeString() {
      return this.data;
    }
  },
  methods: {
    unlinkCar(e){
      const { platenum, stageid } = e.currentTarget.dataset;
      //console.log(plateNum);
      request('/unlink-car', { plateNum: platenum, stageid }).then(res => {
        console.log(res.data);
        this.load();
      }).catch(err => console.log(err));
    },
    load(){
      request('/get-stages')
        .then(res => {
          const stages = res.data.stages.map(stage => {
            stage.dateString = formatTime(new Date(parseInt(stage.start_time)));
            return stage;
          });
          console.log(stages);
          this.setData({ stages });
        })
        .catch(err => console.log(err));
    }
    
  },
  onLoad() {
    console.log('page admin-stages load!');
    this.load();
  }
};
</script>

<style></style>
