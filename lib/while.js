const { loop } = require('./loop');

module.exports = { whileDo, doWhile };


/**
 * While...
 * @param before
 * @param action
 * @param initialResult
 */
function whileDo(before, action, initialResult) {
    return loop(before, action, null, initialResult);
}


/**
 * Do while...
 * @param after
 * @param action
 * @param initialResult
 */
function doWhile(after, action, initialResult) {
    return loop(null, action, after, initialResult);
}



