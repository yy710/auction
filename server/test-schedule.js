const schedule = require('node-schedule');
let date = new Date('2020-02-08 22:55');
let x = 'Tada!';
let test2 = test.bind(null,x);
let j = schedule.scheduleJob(date, test2);
j.id = 'test';
x = 'Changing Data';
test2 = function(){
  console.log("test2");
  return 1;
}
console.log("j: ", j);
console.log("j.job(): ", j.job());
// Job {
//   job: [Function: bound ],
//   callback: false,
//   name: '<Anonymous Job 1>',
//   trackInvocation: [Function],
//   stopTrackingInvocation: [Function],
//   triggeredJobs: [Function],
//   setTriggeredJobs: [Function],
//   cancel: [Function],
//   cancelNext: [Function],
//   reschedule: [Function],
//   nextInvocation: [Function],
//   pendingInvocations: [Function] }

function test(y){
  console.log(y);
  return true;
}