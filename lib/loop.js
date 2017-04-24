const Promise = require('bluebird');

module.exports = { loop };


/**
 * The generic loop.
 *
 * @param before
 * @param action
 * @param after
 * @param prevResult
 * @param counter
 * @returns {Promise.<TResult>}
 */
function loop(before, action, after, prevResult, counter = 1) {
    const thenWrap = (func, result) => Promise.resolve().then(_ => func(result, counter));

    const runNext = curResult => loop(before, action, after, curResult, counter + 1);

    const runAfter = curResult => after
        ? thenWrap(after, curResult)
            .then(ok => ok ? runNext(curResult) : curResult, _ => curResult)
        : runNext(curResult);

    const runAction = prevResult => action(prevResult, counter)
        .then(runAfter);

    return before
        ? thenWrap(before, prevResult)
            .then(ok => ok ? runAction(prevResult) : prevResult, _ => prevResult)
        : runAction(prevResult);
}


