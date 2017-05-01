const { loop } = require('./loop');

module.exports = { whileDo, doWhile };

 
/**
 * While
 * 
 * @param {function|falsy} before   called before every action call
 * @param {function} action         iterated action
 * @param {any} initialResult
 */
function whileDo(before, action, initialResult) {
    return loop(before, action, null, initialResult);
}


/**
 * Do while
 * 
 * @param {function} [after]        called after every action call
 * @param {function} action         iterated action
 * @param {any} initialResult
 */
function doWhile(after, action, initialResult) {
    return loop(null, action, after, initialResult);
}



