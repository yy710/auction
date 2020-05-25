const auctions1 = [];
auctions1.push({ state: 0, price: 10000, reserve: 50000, carid: 0 });
auctions1.push({ state: 0, price: 20000, reserve: 60000, carid: 1 });
auctions1.push({ state: 0, price: 30000, reserve: 70000, carid: 2 });
const auctions2 = [];
auctions2.push({ state: 0, price: 50000, reserve: 80000, carid: 3 });
auctions2.push({ state: 0, price: 60000, reserve: 90000, carid: 4 });
auctions2.push({ state: 0, price: 70000, reserve: 100000, carid: 5 });
const auctions3 = [];
auctions3.push({ state: 0, price: 80000, reserve: 100000, carid: 6 });
auctions3.push({ state: 0, price: 90000, reserve: 110000, carid: 7 });
const tasks = [];
tasks.push({ app_token: 'yz', id: 1, state: 0, auctions: auctions1, start_time: new Date('2020-03-23 07:30') });
tasks.push({ app_token: 'nz', id: 2, state: 0, auctions: auctions2, start_time: new Date('2020-02-27 23:52') });
tasks.push({ app_token: 'yz', id: 3, state: 0, auctions: auctions3, start_time: new Date('2020-02-27 23:56') });

stages = [
  { id: 1, start_time: new Date('2020-03-12 21:25').getTime(), state: 1 },
  { id: 2, start_time: new Date('2020-03-20 08:06').getTime(), state: 1 }
];

// 已成交车辆
const auction = {
  _id: '5ec94c70591ff041f2a40804',
  state: 2,
  price: 7700,
  reserve: 8000,
  car: {
    _id: '5ec94b044c05c6ba8b1a1ecf',
    isAdmin: false,
    plateNum: '云A09876',
    vehicleType: '',
    owner: '',
    addr: '',
    useCharacter: '',
    model: '',
    vin: 'LVSHBFAF29F066713',
    engineNum: '',
    registerDate: '2020-05-23',
    carTitle: '福特3',
    mileage: '6000',
    carDescrible: '好',
    carType: {
      _id: '5e6da9a3bc62d2450c04df3b',
      name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型',
      brand: '福特',
      typename: '蒙迪欧',
      logo: 'http://pic1.jisuapi.cn/car/static/images/logo/300/13874.jpg',
      manufacturer: '长安福特',
      cartype: null,
      yeartype: '2010',
      environmentalstandards: '国四',
      comfuelconsumption: '10.10',
      engine: 'L3',
      fueltype: '汽油',
      gearbox: '6挡 手自一体',
      drivemode: '前轮驱动',
      carbody: null,
      fronttiresize: '225/50 R17',
      reartiresize: '225/50 R17',
      displacement: '2.3L',
      fuelgrade: '92号',
      price: '22.38万',
      chassis: null,
      frontbraketype: '通风盘',
      rearbraketype: '盘式',
      parkingbraketype: '手拉式',
      maxpower: '117',
      sizetype: '中型车',
      gearnum: '6',
      geartype: '手自一体',
      seatnum: '5',
      bodystructure: '承载式',
      maxhorsepower: '160',
      vin: 'LVSHBFAF29F066713',
      carlist: [
        {
          carid: 13874,
          name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型'
        },
        {
          carid: 13875,
          name: '福特 蒙迪欧 2010款 致胜 2.3L 至尊型'
        },
        {
          carid: 13881,
          name: '福特 蒙迪欧 2007款 致胜 2.3L至尊型'
        },
        {
          carid: 13877,
          name: '福特 蒙迪欧 2008款 致胜 2.3L豪华运动型导航版'
        },
        {
          carid: 13873,
          name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华型'
        },
        {
          carid: 13878,
          name: '福特 蒙迪欧 2007款 致胜 2.3L时尚型'
        }
      ]
    },
    images: [
      {
        _id: '5ec94af3591ff041f2a407fc',
        filename: 'PpFWxuzG1590250227503.jpg',
        path: '../uploads/auction/PpFWxuzG1590250227503.jpg',
        size: 17407,
        create_time: '2020-05-23T16:10:27.520Z',
        tagId: '0',
        car_plat_num: '云A09876'
      }
    ],
    stageid: ''
  },
  reserveUser: {
    openid: 'tMCJnOmdz8bEoljQhknimCJsas1W',
    mobile: '18669077718',
    userInfo: {
      nickName: 'weapp'
    }
  },
  startPrice: 6000,
  startTime: 1590250488566,
  buyer: {
    openid: 'tMCJnOmdz8bEoljQhknimCJsas1W',
    mobile: '18669077718',
    userInfo: {
      nickName: 'weapp'
    },
    price: 8000
  },
  maxSockets: 0,
  logs: [
    {
      _id: '5ec94c01591ff041f2a40801',
      tag: 'auction',
      date: '2020-05-23T16:14:57.122Z',
      action: 'addPrice',
      data: {
        action: 'addPrice',
        carid: '云A09876',
        price: 6000,
        addNum: '1000',
        user: {
          openid: 'cDMMPkgbb4RSikIrTlskGt3ksZqH',
          mobile: '18669077710',
          userInfo: {
            nickName: 'admin'
          }
        }
      }
    },
    {
      _id: '5ec94c10591ff041f2a40802',
      tag: 'auction',
      date: '2020-05-23T16:15:12.645Z',
      action: 'addPrice',
      data: {
        action: 'addPrice',
        carid: '云A09876',
        price: 7000,
        addNum: '500',
        user: {
          openid: 'tMCJnOmdz8bEoljQhknimCJsas1W',
          mobile: '18669077718',
          userInfo: {
            nickName: 'weapp'
          }
        }
      }
    }
  ],
  endTime: 1590250608571
};

const log = {
  _id: '5ec94c13591ff041f2a40803',
  tag: 'auction',
  date: new Date('2020-05-23T16:15:15.805Z'),
  action: 'addPrice',
  data: {
    action: 'addPrice',
    carid: '云A09876',
    price: 7500,
    addNum: '200',
    user: {
      openid: 'cDMMPkgbb4RSikIrTlskGt3ksZqH',
      mobile: '18669077710',
      userInfo: {
        nickName: 'admin'
      }
    }
  }
};

const log2 = {
  _id: '5ec94b60591ff041f2a40800',
  tag: ['auction'],
  date: new Date('2020-05-23T16:12:16.881Z'),
  action: 'addPrePrice',
  data: {
    prePrice: 8000,
    carid: '云A09876',
    user: {
      openid: 'tMCJnOmdz8bEoljQhknimCJsas1W',
      mobile: '18669077718',
      userInfo: {
        nickName: 'weapp'
      }
    }
  }
};

const stages2 = {
  _id: '5ec94b064c05c6ba8b1a1ed6',
  app_token: 'yz_auction',
  start_time: '1590250488559',
  state: 3,
  reserve_time: 120,
  auction_time: 20,
  current_auction: {},
  auctions: [
    {
      state: 0,
      price: 6000,
      reserve: 8000,
      car: {
        _id: '5ec94b044c05c6ba8b1a1ecf',
        isAdmin: false,
        plateNum: '云A09876',
        vehicleType: '',
        owner: '',
        addr: '',
        useCharacter: '',
        model: '',
        vin: 'LVSHBFAF29F066713',
        engineNum: '',
        registerDate: '2020-05-23',
        carTitle: '福特3',
        mileage: '6000',
        carDescrible: '好',
        carType: {
          _id: '5e6da9a3bc62d2450c04df3b',
          name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型',
          brand: '福特',
          typename: '蒙迪欧',
          logo: 'http://pic1.jisuapi.cn/car/static/images/logo/300/13874.jpg',
          manufacturer: '长安福特',
          cartype: null,
          yeartype: '2010',
          environmentalstandards: '国四',
          comfuelconsumption: '10.10',
          engine: 'L3',
          fueltype: '汽油',
          gearbox: '6挡 手自一体',
          drivemode: '前轮驱动',
          carbody: null,
          fronttiresize: '225/50 R17',
          reartiresize: '225/50 R17',
          displacement: '2.3L',
          fuelgrade: '92号',
          price: '22.38万',
          chassis: null,
          frontbraketype: '通风盘',
          rearbraketype: '盘式',
          parkingbraketype: '手拉式',
          maxpower: '117',
          sizetype: '中型车',
          gearnum: '6',
          geartype: '手自一体',
          seatnum: '5',
          bodystructure: '承载式',
          maxhorsepower: '160',
          vin: 'LVSHBFAF29F066713',
          carlist: [
            {
              carid: 13874,
              name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型'
            },
            {
              carid: 13875,
              name: '福特 蒙迪欧 2010款 致胜 2.3L 至尊型'
            },
            {
              carid: 13881,
              name: '福特 蒙迪欧 2007款 致胜 2.3L至尊型'
            },
            {
              carid: 13877,
              name: '福特 蒙迪欧 2008款 致胜 2.3L豪华运动型导航版'
            },
            {
              carid: 13873,
              name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华型'
            },
            {
              carid: 13878,
              name: '福特 蒙迪欧 2007款 致胜 2.3L时尚型'
            }
          ]
        },
        images: [
          {
            _id: '5ec94af3591ff041f2a407fc',
            filename: 'PpFWxuzG1590250227503.jpg',
            path: '../uploads/auction/PpFWxuzG1590250227503.jpg',
            size: 17407,
            create_time: new Date('2020-05-23T16:10:27.520Z'),
            tagId: '0',
            car_plat_num: '云A09876'
          }
        ],
        stageid: ''
      },
      reserveUser: {
        openid: 'tMCJnOmdz8bEoljQhknimCJsas1W',
        mobile: '18669077718',
        userInfo: {
          nickName: 'weapp'
        }
      }
    }
  ],
  apptoken: 'yz_auction',
  id: 'grWGvad6'
};

const car = {
  _id: '5ec94b044c05c6ba8b1a1ecf',
  isAdmin: false,
  plateNum: '云A09876',
  vehicleType: '',
  owner: '',
  addr: '',
  useCharacter: '',
  model: '',
  vin: 'LVSHBFAF29F066713',
  engineNum: '',
  registerDate: '2020-05-23',
  carTitle: '福特3',
  mileage: '6000',
  carDescrible: '好',
  carType: {
    _id: '5e6da9a3bc62d2450c04df3b',
    name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型',
    brand: '福特',
    typename: '蒙迪欧',
    logo: 'http://pic1.jisuapi.cn/car/static/images/logo/300/13874.jpg',
    manufacturer: '长安福特',
    cartype: null,
    yeartype: '2010',
    environmentalstandards: '国四',
    comfuelconsumption: '10.10',
    engine: 'L3',
    fueltype: '汽油',
    gearbox: '6挡 手自一体',
    drivemode: '前轮驱动',
    carbody: null,
    fronttiresize: '225/50 R17',
    reartiresize: '225/50 R17',
    displacement: '2.3L',
    fuelgrade: '92号',
    price: '22.38万',
    chassis: null,
    frontbraketype: '通风盘',
    rearbraketype: '盘式',
    parkingbraketype: '手拉式',
    maxpower: '117',
    sizetype: '中型车',
    gearnum: '6',
    geartype: '手自一体',
    seatnum: '5',
    bodystructure: '承载式',
    maxhorsepower: '160',
    vin: 'LVSHBFAF29F066713',
    carlist: [
      {
        carid: 13874,
        name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华运动型'
      },
      {
        carid: 13875,
        name: '福特 蒙迪欧 2010款 致胜 2.3L 至尊型'
      },
      {
        carid: 13881,
        name: '福特 蒙迪欧 2007款 致胜 2.3L至尊型'
      },
      {
        carid: 13877,
        name: '福特 蒙迪欧 2008款 致胜 2.3L豪华运动型导航版'
      },
      {
        carid: 13873,
        name: '福特 蒙迪欧 2010款 致胜 2.3L 豪华型'
      },
      {
        carid: 13878,
        name: '福特 蒙迪欧 2007款 致胜 2.3L时尚型'
      }
    ]
  },
  images: [
    {
      _id: '5ec94af3591ff041f2a407fc',
      filename: 'PpFWxuzG1590250227503.jpg',
      path: '../uploads/auction/PpFWxuzG1590250227503.jpg',
      size: 17407,
      create_time: new Date('2020-05-23T16:10:27.520Z'),
      tagId: '0',
      car_plat_num: '云A09876'
    }
  ],
  stageid: 'grWGvad6'
};

module.exports = {
  tasks,
  stages,
  states: new Map([
    [1, '未加入竞价'],
    [2, '等待竞价开始'],
    [3, '正在竞价'],
    [4, '流拍'],
    [5, '竞价成功，等待买家确认'],
    [6, '买家未确认，扣除保证金'],
    [7, '买家已确认，等待办手续'],
    [8, '正在办提车手续'],
    [9, '交易结束']
  ]),
  //图片信息
  image: {
    //"_id" : ObjectId("5e6af4cb61fce4785046349f"),
    filename: '98UAsk5L1584067787115.jpg',
    path: '../uploads/auction/98UAsk5L1584067787115.jpg',
    size: 21613,
    create_time: new Date('2020-03-13T02:49:47.132Z'),
    tagId: '1',
    car_plat_num: '云A00001'
  },
  // image: {
  //     id: 1,
  //     name: '',
  //     describle: '',
  //     sort: '',
  //     url: '',
  //     upload_time: Date(),
  //     upload_user: {}
  // },
  // 产品信息
  product: {
    id: 1, // 唯一识别Id或二维码
    name: '速腾', // 显示名称
    state: 1, // 交易状态
    describle: '', // 简单描述
    license: {}, // 行驶证信息
    modelId: '', // 车型代码
    images: [], // 车辆图片
    report: {} // 检测报告
  },
  // 竞价场次
  stage: {
    app_token: 'yz',
    state: 1, // 0: disable, 1: enable, 2: create job for ready, 3: auction, 4: pause， 5: end
    start_time: new Date(), // 起拍时间
    reserve_time: 120, // 保留价时间，单位：second，超时流拍
    auction_time: 20, // 竞价间隔时间，单位：second, success after timeout
    current_auction: {}, // current auction to be doing
    auctions: [] // 竞价对象列表，按顺序依次竞价
  },
  // 竞价车辆
  auction: {
    productId: 1, // 竞价产品ID
    startPrice: 100, // 起拍价
    reservePrice: 200, // 保留价
    finalPrice: 300, // 成交价
    buyer: {}, // 买家
    logs: [] // 竞价记录
  },
  // 买家信息
  buyer: {
    id: '',
    openid: '',
    name: '',
    mobile: ''
  }
};
