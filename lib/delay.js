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
 *       .then(delay(100))
 *       .then(res => console.log('111 + 222 =', res))</pre>
 *
 * @param millis
 */
function delayResolve(millis) {
    return value => new Promise(resolve => setTimeout(() => resolve(value), millis));
}


/**
 * Delay reject...
 * @param millis
 * @returns {function(*=): Promise}
 */
function delayReject(millis) {
    return value => new Promise((resolve, reject) => setTimeout(() => reject(value), millis));
}


function delay(millis, value) {
    return delayResolve(millis)(value);
}

