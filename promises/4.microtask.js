/**
 * Promise handlers .then/.catch/.finally are always asynchronous.

Even when a Promise is immediately resolved, the code on the lines below .then/.catch/.finally will still execute before these handlers.

Here’s a demo:
 */

let promise = Promise.resolve();

promise.then(() => console.log("promise done!"));

console.log("code finished"); // this alert shows first
/**
 * Microtasks queue
Asynchronous tasks need proper management. For that, the ECMA standard specifies an internal queue PromiseJobs, more often referred to as the “microtask queue” (V8 term).
    The queue is first-in-first-out: tasks enqueued first are run first.
    Execution of a task is initiated only when nothing else is running.
Or, to put it more simply, when a promise is ready, its .then/catch/finally handlers are put into the queue; they are not executed yet. When the JavaScript engine becomes free from the current code, it takes a task from the queue and executes it.
 */

/**
 * Promise handlers always go through this internal queue.

If there’s a chain with multiple .then/catch/finally, then every one of them is executed asynchronously. That is, it first gets queued, then executed when the current code is complete and previously queued handlers are finished.

What if the order matters for us? How can we make code finished appear after promise done?

Easy, just put it into the queue with .then:
 */

Promise.resolve()
  .then(() => console.log("promise done!"))
  .then(() => console.log("code finished"));

/**
 * An “unhandled rejection” occurs when a promise error is not handled at the end of the microtask queue.

Normally, if we expect an error, we add .catch to the promise chain to handle it:
 */
let promise2 = Promise.reject(new Error("Promise Failed1!"));
promise2.catch(err => console.log('caught'));
// console.log(promise2)

// doesn't run: error handled
process.on('unhandledRejection', error => {
    console.error('unhandledRejection1', error);

});

//But if we forget to add .catch, then, after the microtask queue is empty, the engine triggers the event:
const promise3 = Promise.reject("error");
console.log(promise3)
// // Promise Failed!
process.on('unhandledRejection', event => {
    console.error('unhandledRejection', event);
});

/**
 * Now, if we run it, we’ll see Promise Failed! first and then caught.

If we didn’t know about the microtasks queue, we could wonder: “Why did unhandledrejection handler run? We did catch and handle the error!”

But now we understand that unhandledrejection is generated when the microtask queue is complete: the engine examines promises and, if any of them is in the “rejected” state, then the event triggers.

In the example above, .catch added by setTimeout also triggers. But it does so later, after unhandledrejection has already occurred, so it doesn’t change anything.
 */