function *execAuction(aus){
    for(i=0;i<aus.length;i++){
        const a = yield i*10;
        console.log("xxx: ", a);
    }
    return 'end';
}

const aus = [1, 2,3];
const exe = execAuction(aus);
console.log(exe);
console.log(exe.next(100));
console.log(exe.next(78));
console.log(exe.next(88));
console.log(exe.next());

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
