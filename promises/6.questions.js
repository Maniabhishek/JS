async function wait() {
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    return 10;
  }
  
  function run() {
    //what should we write to get the output of wait method without using await
    //if we use below code to get the output , we will get promise pending
    console.log(wait());
    // why does the above code gives us pending object becasue when we are executing wait method , at line 2 await is used so the function will be suspended and thus it doesn't reaches to line 10 hence we get as promise pending 
    // use below code to get the code 
    wait().then(res=> console.log(res));
  }
  run();