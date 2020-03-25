function timeOut2second(){
    return new Promise(function(resolve, reject){
        setTimeout(resolve, 2000);
    });
}

async function a(n){
    let res = "a() no await";
    if(n){
        await timeOut2second();
        res = "a() await";
    }
    console.log(res);
}

function b(n){
    let res = "b() no await";
    if(n){
        timeOut2second().then(()=>res = "b() await").catch(err=>console.log(err));
    }
    console.log(res);
}

a(1);
b(1);