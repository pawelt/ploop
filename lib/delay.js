const Promise = require('bluebird');

module.exports = { delayResolve, delayReject, delay };


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
function delayResolve(millis) {
    return value => new Promise(resolve => setTimeout(() => resolve(value), millis));
}


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
function delayReject(millis) {
    return value => new Promise((resolve, reject) => setTimeout(() => reject(value), millis));
}

/**
 * 
 * @param {number} millis   number of milliseconds to wait
 * @param {any} [value]     value to resolve after `millis` milliseconds
 * @returns {Promise}
 */
function delay(millis, value) {
    return delayResolve(millis)(value);
}

