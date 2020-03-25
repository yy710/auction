Component({
  properties: {
    imageURLs: {
      type: Array,
      value: ['../../images/home/car1.jpg', '../../images/home/car2.jpg'],
      observer(newVal, oldVal){}
    },
    video: {
      type: Object,
      value: { video_url: '' }
    }
  },

  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000
  },

  methods: {

  }
})
