const EventEmitter = require('events');
class DataBus extends EventEmitter { };
//const dataBus = new DataBus();// for trigger next auction

// let _fn = aaa;
// let fn = function(msg){
//     _fn(msg);
// };
// dataBus.on('msg1', fn);
// //dataBus.on('msg1', bbb);

// function aaa(msg){
//     console.log("aaa: ", msg);
// }

// function bbb(msg){
//     console.log("bbb: ", msg);
// }

// _fn = bbb;
// dataBus.emit('msg1', {id: 100});

//===============================================================
// function Task() {
//     this.dataBus = new DataBus();
//     this.handle = function (msg) {
//         console.log('default handle(): ', msg);
//     };
//     this.setDataBus();
// }

// Task.prototype.setDataBus = function (fn = this.handle) {
//     this.dataBus.removeAllListeners('next');
//     this.dataBus.on('next', fn);
//     return this;
// };

// Task.prototype.next = function (msg) {
//     this.dataBus.emit('next', msg);
//     return this;
// };

// Task.createJob = function(){
//     const job = new Task();
//     console.log('createJob(): ', job);
//     return job;
// }

// const task = new Task();
// console.log(task);
// task.setDataBus(handle2);
// task.next({ id: 1 });

// const job = Task.createJob();
// console.log(job);

function handle2(msg) {
    console.log('handle2(): ', msg);
}

//======================================================
class Task {
    constructor() {
        this.dataBus = new DataBus();
        // this.handle = function (msg) {
        //     console.log('this.handle(): ', msg);
        // };
        this.dataBus.on('next', msg => {
            this.handle(msg);
        });
    }

    handle(msg) {
        console.log('this.handle(): ', msg);
    }

    setDataBus(f) {
        //this.dataBus.removeAllListeners('next');
        if (typeof f == 'function') this.handle = f;
        return this;
    }

    next(msg) {
        this.dataBus.emit('next', msg);
        return this;
    }

    static createJob() {
        console.log("static createJob(): ");
        return new Task();
    }
}

const task = new Task();
console.log(task);
task.next({ id: 1 });
task.setDataBus(handle2).next({ id: 2 });
//console.log(Task.createJob());