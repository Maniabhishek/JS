/**
 * Promise chains are great at error handling. When a promise rejects, the control jumps to the closest rejection handler. That’s very convenient in practice.

For instance, in the code below the URL to fetch is wrong (no such site) and .catch handles the error:

 */
import fetch from "node-fetch";

fetch("abc").then((response)=>{
        return response.json();
    })
    .then(json=>{
        console.log(json)
    })
    .catch(err=>{
        console.log("error here ",err.message)
    })

fetch("https://jsonplaceholder.typicode.com/todos/1").then((response)=>{
        return response.json();
    })
    .then(json=>{
        console.log(json)
    })
    .catch(err=>{
        console.log("error here ",err.message)
    })

/**
 * Implicit try…catch
The code of a promise executor and promise handlers has an "invisible try..catch" around it. If an exception happens, it gets caught and treated as a rejection.

For instance, this code:
 */

new Promise((resolve,reject)=>{
    throw new Error("whoops error");
}).catch(err=>{
    console.log(err.message)
});

//…Works exactly the same as this:
new Promise((resolve,reject)=>{
    reject(new Error("whoops error"));
}).catch(err=>{
    console.log("reject",err.message)
});

/**
 * The "invisible try..catch" around the executor automatically catches the error and turns it into rejected promise.
This happens not only in the executor function, but in its handlers as well. If we throw inside a .then handler, that means a rejected promise, so the control jumps to the nearest error handler.
 */

new Promise((resolve, reject) => {
    resolve("ok");
  }).then((result) => {
    throw new Error("Whoops!"); // rejects the promise
  }).catch(err=>{
    console.log("line 59",err.message)
  }); // Error: Whoops!

/**
 * Rethrowing
As we already noticed, .catch at the end of the chain is similar to try..catch. We may have as many .then handlers as we want, and then use a single .catch at the end to handle errors in all of them.

In a regular try..catch we can analyze the error and maybe rethrow it if it can’t be handled. The same thing is possible for promises.

If we throw inside .catch, then the control goes to the next closest error handler. And if we handle the error and finish normally, then it continues to the next closest successful .then handler.

In the example below the .catch successfully handles the error:
 */

new Promise((resolve,reject)=>{
    throw new Error("whoops error");
}).catch(err=>{
    console.log("error handled ", err.message);
}).then(()=>{
    console.log("successful handler runs");
});

/**
 * In the example below we see the other situation with .catch. The handler (*) catches the error and just can’t handle it (e.g. it only knows how to handle URIError), so it throws it again:
 */
new Promise((resolve,reject)=>{
    throw new Error("whoops error");
}).catch((err)=>{
    if(err instanceof URIError){
        //handle it 
    }else{
        throw err
    }
}).then(()=>{
    console.log("handle ")
}).catch(err=>{
    console.log(err);
});

//unhandled reejections
new Promise(function() {
    noSuchFunction(); // Error here (no such function)
  })
    .then(() => {
      // successful promise handlers, one or more
    }); // without .catch at the end!

/**
 * n case of an error, the promise becomes rejected, and the execution should jump to the closest rejection handler. But there is none. So the error gets “stuck”. There’s no code to handle it.

In practice, just like with regular unhandled errors in code, it means that something has gone terribly wrong.

What happens when a regular error occurs and is not caught by try..catch? The script dies with a message in the console. A similar thing happens with unhandled promise rejections.

The JavaScript engine tracks such rejections and generates a global error in that case. You can see it in the console if you run the example above.
 */