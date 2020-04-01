const { request } = require('../../utils/util');

Component({
  properties: {
    phone: null
  },

  data: {

  },

  lifetimes: {
    attached(){
      request('/get-userphone', {}).then(res => {
        console.log("get-userphone: ", res.data);
        const phone = res.data.content;
        this.setData({ phone });
      }).catch(err => console.log(err));
    }
  },

  methods: {
    getPhoneNumber(e){
      console.log('getPhoneNumber: e');
      delete e.detail.errMsg;
      request('/update-userphone', { ...e.detail }).then(res => {
        //
        console.log("update-phone: ", res.data);
      }).catch(err => consolelog(err));
    }
  }
})
