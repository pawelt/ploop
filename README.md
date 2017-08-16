# ploop

Promise LOOPing utility functions.


## Examples

...

## Looping functions

```js
/**
 * Retry
 * 
 * `opts` has to be a number or an options object with fields:
 * - {number}           limit       - maximum number of retries
 * - {number:function}  backoff     - backoff function or number of milliseconds to pause after each 
 * - {function}         before      - function called before every attempt (can be asynchronous)
 * - {function}         after       - function called after every attempt (can be asynchronous)
 *
 * @param {number|object} opts  maximum number of retries or options object
 * @param {function} action     an action to retry (can be asynchronous)
 * @param {any} [initialResult]
 * @returns {Promise}
 */
function retry(opts, action, initialResult)
```


```js
/**
 * Map concurrently
 * 
 * @param {array} collection
 * @param {function} mapper 
 * @param {boolean} [breakEarly = false]
 * @param {number} [concurrency = Infinite]
 */
function map(collection, mapper, breakEarly = false, concurrency = 1234567890)
```


```js
/**
 * Map serially
 * 
 * @param {array} collection 
 * @param {function} mapper 
 * @param {boolean} [breakEarly = false] 
 */
function map(collection, mapper, breakEarly = false, concurrency = 1)
```


```js
/**
 * While - Do loop
 * 
 * @param {function|falsy} before   called before every action call
 * @param {function} action         iterated action
 * @param {any} initialResult
 */
function whileDo(before, action, initialResult)
```


```js
/**
 * Do - While loop
 * 
 * @param {function} [after]        called after every action call
 * @param {function} action         iterated action
 * @param {any} initialResult
 */
function doWhile(after, action, initialResult)
```


```js
/**
 * Generic looping utility, used internally by more specialised functions.
 * 
 * `before` and `after` functions are used as loop stopping conditions.
 *
 * @param {function|falsy} before   called before every action call
 * @param {function} action         iterated action
 * @param {function} [after]        called after every action call
 * @param {any} [initialResult]     value used in the first iteration
 * @param {number} [counter = 1]    interation number
 * @returns {Promise}
 */
function loop(before, action, after, initialResult, counter = 1)
```


## Utility functions

```js
/**
 * Creates a function that returns a promise resolved after <i>milllis</i> milliseconds.
 *
 * Simple usage:
 * <pre>  delayResolve(100)('!').then(shout => console.log('delayed message' + shout))</pre>
 *
 * Chained usage with argument forwarding:
 * <pre>
 *   Promise.resolve(333)
 *       .then(delayResolve(100))
 *       .then(res => console.log('111 + 222 =', res))</pre>
 *
 * @param {number} millis   number of milliseconds to wait
 * @returns {function(value): Promise}
 */
function delayResolve(millis)
```


```js
/**
 * Similar to delayResolve, but created function rejects instead.
 * 
 * Chained usage with argument forwarding:
 * <pre>
 *   Promise.reject(333)
 *       .catch(delayReject(100))
 *       .catch(res => console.log('111 + 222 =', res))</pre>
 * 
 * @param {number} millis   number of milliseconds to wait
 * @returns {function(value): Promise}
 */
function delayReject(millis)
```


```js
/**
 * 
 * @param {number} millis   number of milliseconds to wait
 * @param {any} [value]     value to resolve after `millis` milliseconds
 * @returns {Promise}
 */
function delay(millis, value)
```
