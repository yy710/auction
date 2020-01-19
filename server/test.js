const EventEmitter = require('events');
class MyEventEmitter extends EventEmitter { };

function *execAuction(aus){
    for(i=0;i<aus.length;i++){
        const a = yield i*10;
        console.log("xxx: ", a);
    }
    return 'end';
}

const aus = [1, 2, 3];
const exe = execAuction(aus);
console.log(exe);
console.log(exe.next(100));
console.log(exe.next(78));
console.log(exe.next(88));
console.log(exe.next());




const ev = new MyEventEmitter();
ev.on('event1', function(data){
    console.log("event1: ", data);
});

/*
function *ea2(aus){
    function a(aus){
        if(aus.length==0)return;
        const au = aus.shift();
        const inData = yield au;
        console.log("inData: ", inData);
        a(aus);
    }
    a();
}

const g1 = ea2([3,2,1]);
console.log("g1.next(): ", g1.next(10)); 

const EventEmitter = require('events');
class MyEventEmitter extends EventEmitter { };

const ev = new MyEventEmitter();

ev.on('next', ()=>{
    console.log("222");
});

ev.on('next', ()=>{
    console.log("111");
});

setTimeout(()=>{ ev.emit('next', '') }, 1000); 


const obj = { a: 1, b: 2 };

function change(obj) {
    return function (n) {
        obj.a = n;
        return obj;
    };
}

const b = change(obj);
console.log("obj.a = ", obj.a);
const c = b(10);
c.a = 100;
console.log("obj.a = ", obj.a);

async function w1() {
    const a = await w2();
    return a;
};

function w2() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve(1), 2000);
    });
}

w1().then(r => console.log("async 0k! ", r)); 
*/

/* --------------------------------------------------------------
const startAuction = _startAuction(wss, countDown);
const genExecAuction = execAuction(auctions);
let auction = genExecAuction.next();
startAuction(auctions.shift());

function* execAuction(aucs) {
    for (i = 0; i < aucs.length; i++) {
        const inData = yield aucs.shift();
        console.log("inData: ", inData);
    }
    return { code: 1 };
}

// closure 函数, currying
function _startAuction(wss, countDown) {
    return function (auc) {
        wss.removeAllListeners('connection');
        countDown.reset(20 * 60);
        let { state, price, reserve, carid } = auc;
        state = 1;
        broadcast({ price, time: countDown.get(), state, carid });

        wss.on('connection', function (socket, req) {
            const ip = req.connection.remoteAddress;
            console.log("wss.clients.size: ", wss.clients.size);
            console.log("client ip: ", ip);
            console.log("client token: ", req.headers.token);

            socket.send(JSON.stringify({ price, time: countDown.get(), state, carid }), { binary: false });// time is left millseconds 

            // --------------------------------------------------------
            socket.on('message', function (_msg) {
                const msg = JSON.parse(_msg);
                console.log("Received message: ", msg);
                if (msg.price) {
                    price += msg.price;
                    if (price >= reserve) {
                        // start 20s 计时器
                        countDown.reset(20);
                    }
                    // reset price, time for all
                    broadcast({ price, time: countDown.get(), state, carid });
                }
            });

            socket.on('close', function () {
                console.log("websocket connection closed");
            });
        });

        function broadcast(data) {
            wss.clients.forEach(function (client) {
                // SocketServer: { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 }
                if (client.readyState === 1) {
                    client.send(JSON.stringify(data));
                }
            });
        };

        return wss;
    };
}
------------------------------------------------------------------------------- */
