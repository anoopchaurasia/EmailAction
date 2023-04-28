let running=false;
module.exports = async taskData => {
    // do stuff
    if(running) return;
    let i=0;
    setInterval(x=>console.log("started", ++i, running), 5000)
    console.log("task started");
    running = true;
    return new Promise((res, r)=> console.log(res, r));
  };