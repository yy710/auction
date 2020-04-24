<template>
  <view>
    <van-cell-group title="车型信息" v-if="show == 'field'">
      <van-field v-for="(item, index) in _carType" :key="index" v-if="t[index]" :value="item" :label="t[index]" border="false" :id="index" @change="onChange"></van-field>
    </van-cell-group>

    <van-cell-group title="车型信息" v-if="show == 'cell'">
      <van-cell v-for="(item, index) in _carType" :key="index" v-if="t[index]" :value="item" :title="t[index]"></van-cell>
    </van-cell-group>

    <van-button v-if="show == 'field' && !sure" type="primary" block @click="onConfirm">确认以上信息正确</van-button>
  </view>
</template>

<script>
global['__wxRoute'] = 'components/cartype/cartype';
Component({
  properties: {
    carType: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        this.setData({ _carType: newVal });
      }
    },
    show: {
      type: String,
      value: 'field'
    }
  },

  data: {
    sure: false,
    _carType: {},
    t: {
      manufacturer: '厂家名称',
      brand: '品牌',
      cartype: '车型',
      name: '名称',
      yeartype: '年款',
      environmentalstandards: '排放标准',
      comfuelconsumption: '油耗',
      engine: '发动机',
      gearbox: '变速箱',
      drivemode: '驱动方式',
      carbody: '车身形式',
      fronttiresize: '前轮胎尺寸',
      reartiresize: '后轮胎尺寸',
      //vin: "车架号",
      fueltype: '燃油类型',
      displacement: '排量(L)',
      fuelgrade: '燃油标号',
      price: '新车购置价格',
      frontbraketype: '前制动类型',
      rearbraketype: '后制动类型',
      parkingbraketype: '驻车制动类型',
      maxpower: '最大功率(KW)',
      sizetype: '尺寸类型',
      gearnum: ' 档位数',
      geartype: '变速箱类型',
      seatnum: '座位数',
      bodystructure: '车体结构',
      maxhorsepower: '最大马力(Ps)'
      //carlist: "车型列表",
      //carid: "车ID 对应车型API中的ID",
      //logo: "LOGO"
    }
  },

  lifetimes: {},

  methods: {
    onConfirm() {
      this.triggerEvent('confirm', this.data._carType);
      this.setData({ sure: true });
    },
    onChange(e) {
      console.log('onChange: ', e);
      this.setData({ [`_carType.${e.target.id}`]: e.detail });
    }
  }
});
export default global['__wxComponents']['components/cartype/cartype'];
</script>
