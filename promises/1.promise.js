/**
 * A “producing code” that does something and takes time. For instance, some code that loads the data over a network. That’s a “singer”.
A “consuming code” that wants the result of the “producing code” once it’s ready. Many functions may need that result. These are the “fans”.
A promise is a special JavaScript object that links the “producing code” and the “consuming code” together. In terms of our analogy: this is the “subscription list”. The “producing code” takes whatever time it needs to produce the promised result, and the “promise” makes that result available to all of the subscribed code when it’s ready.
 */

//The constructor syntax for a promise object is:
let p = new Promise((resolve,reject)=>{
    // executer (the producing code)
})

/**
 * When the executor obtains the result, be it soon or late, doesn’t matter, it should call one of these callbacks:
    resolve(value) — if the job is finished successfully, with result value.
    reject(error) — if an error has occurred, error is the error object.
 */

/**
 * The promise object returned by the new Promise constructor has these internal properties:

state — initially "pending", then changes to either "fulfilled" when resolve is called or "rejected" when reject is called.
result — initially undefined, then changes to value when resolve(value) is called or error when reject(error) is called.
 */

//So the executor eventually moves promise to one of these states:
// exectutor => {state: "fulfilled" ,result: value} or executor => {state: "rejected", result: error}

//Here’s an example of a promise constructor and a simple executor function with “producing code” that takes time (via setTimeout):
const promise = new Promise((resovle,reject)=>{
	setTimeout(()=>{
		resovle(2);
	},1000)
});
/**
 * We can see two things by running the code above:

The executor is called automatically and immediately (by new Promise).

The executor receives two arguments: resolve and reject. These functions are pre-defined by the JavaScript engine, so we don’t need to create them. We should only call one of them when ready.

After one second of “processing”, the executor calls resolve("done") to produce the result. This changes the state of the promise object:
new Promise object => {state: pending , result: undefined}
after 1 sec it resolves to {state: fulfilled, result: 1}
 */

//now an example of the executor rejecting the promise with an error:
const promise2 = new Promise((resolve,reject)=>{
	setTimeout(()=>{
		reject(new Error("error here "))
	},1000)
})

// new Promise object initially {state: "pending", result: undefined}
// after 1 sec promise object changes to {state: "rejected", result: error}

//A promise that is either resolved or rejected is called “settled”, as opposed to an initially “pending” promise.

/**
 * The executor should call only one resolve or one reject. Any state change is final.

		All further calls of resolve and reject are ignored:
 */

const promise3 = new Promise((resolve,reject)=>{
	resolve("done");
	reject("error");//ignored
	setTimeout(()=>{
		//....
	});//ignored
})

/** 
 * The idea is that a job done by the executor may have only one result or an error.

	Also, resolve/reject expect only one argument (or none) and will ignore additional arguments.
 */

/**
 * In case something goes wrong, the executor should call reject. That can be done with any type of argument (just like resolve). But it is recommended to use Error objects (or objects that inherit from Error)
 */

/**
 * In practice, an executor usually does something asynchronously and calls resolve/reject after some time, but it doesn’t have to. We also can call resolve or reject immediately, like this:
 */

const promise4 = new Promise((resolve)=>{
	resolve(123);//immediately resolves to 123
})

// the state and result are internal
/** 
 * The properties state and result of the Promise object are internal. We can’t directly access them. We can use the methods .then/.catch/.finally for that. They are described below.
 */

//consumers : then , catch
/**
 * A Promise object serves as a link between the executor (the “producing code” or “singer”) and the consuming functions (the “fans”), which will receive the result or error. Consuming functions can be registered (subscribed) using the methods .then and .catch.
 */

//The most important, fundamental one is .then.
//The syntax is:
promise.then(
	function(result){/* handles a successful result */},
	function(error){ /* handles an error */}
)

/**
 * The first argument of .then is a function that runs when the promise is resolved and receives the result.

The second argument of .then is a function that runs when the promise is rejected and receives the error.

For instance, here’s a reaction to a successfully resolved promise:
 */

const promise5 = new Promise((resolve,reject)=>{
	setTimeout(()=>{
		resolve(1);
	},1000)
});

promise5.then(
	function(result){console.log("resolved promise",result)},
	function(error){console.log("this is error",error)}
)

//or

promise5.then(
	result => console.log(result),
	error => console.log(error)
)

//The first function was executed.
//And in the case of a rejection, the second one:

/**
 * Cleanup: finally
Just like there’s a finally clause in a regular try {...} catch {...}, there’s finally in promises.

The call .finally(f) is similar to .then(f, f) in the sense that f runs always, when the promise is settled: be it resolve or reject.

The idea of finally is to set up a handler for performing cleanup/finalizing after the previous operations are complete.

E.g. stopping loading indicators, closing no longer needed connections, etc.

Think of it as a party finisher. No matter was a party good or bad, how many friends were in it, we still need (or at least should) do a cleanup after it.

The code may look like this:
 */

new Promise((resolve, reject) => {
  /* do something that takes time, and then call resolve or maybe reject */
})
  // runs when the promise is settled, doesn't matter successfully or not
  .finally(() => "stop")
  // so the loading indicator is always stopped before we go on
  .then(result =>" show result", err => "show error")

/**
 * Please note that finally(f) isn’t exactly an alias of then(f,f) though.

There are important differences:

A finally handler has no arguments. In finally we don’t know whether the promise is successful or not. That’s all right, as our task is usually to perform “general” finalizing procedures.

Please take a look at the example above: as you can see, the finally handler has no arguments, and the promise outcome is handled by the next handler.

A finally handler “passes through” the result or error to the next suitable handler.

For instance, here the result is passed through finally to then:
 */

new Promise((resolve, reject) => {
  setTimeout(() => resolve("value"), 200);
})
  .finally(() => console.log("Promise ready")) // triggers first
  .then(result => console.log(result)); // <-- .then shows "value"

/**
 * As you can see, the value returned by the first promise is passed through finally to the next then.

That’s very convenient, because finally is not meant to process a promise result. As said, it’s a place to do generic cleanup, no matter what the outcome was.

And here’s an example of an error, for us to see how it’s passed through finally to catch:
 */

new Promise((resolve, reject)=>{
	setTimeout(()=>{
		reject(new Error("error here"))
	},1000)
}).finally(()=>{
	console.log("promise ready");
}).catch((err)=>{
	console.log(err.message)
})

/**
 * 	A finally handler also shouldn’t return anything. If it does, the returned value is silently ignored.

The only exception to this rule is when a finally handler throws an error. Then this error goes to the next handler, instead of any previous outcome.
 */