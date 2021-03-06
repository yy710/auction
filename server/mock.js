module.exports = {
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
        id: 1,
        name: '',
        describle: '',
        sort: '',
        url: '',
        upload_time: Date(),
        upload_user: {}
    },

    // 产品信息
    product: {
        id: 1,  // 唯一识别Id或二维码
        name: "速腾",   // 显示名称
        state: 1,// 交易状态
        describle: '',  // 简单描述
        license: {},    // 行驶证信息
        modelId: '',    // 车型代码
        images: [],  // 车辆图片
        report: {}  // 检测报告 
    },

    // 竞价场次
    stage: {
        startTime: new Date(),  // 起拍时间
        reserveTime: 20,    // 保留价时间，单位：minute，超时流拍
        auctionTime: 20,    // 竞价间隔时间，单位：second
        auctions: [],    // 竞价对象列表，按顺序依次竞价
        enable: true    // 有效标示
    },


    // 竞价车辆
    auction:
    {
        productId: 1,   // 竞价产品ID
        startPrice: 100,    // 起拍价
        reservePrice: 200,  // 保留价
        finalPrice: 300,    // 成交价
        buyer: {},   // 买家
        logs: []    // 竞价记录
    },

    // 买家信息
    buyer: {
        id: '',
        openid: '',
        name: '',
        mobile: ''
    }
};