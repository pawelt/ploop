const Promise = require('bluebird');

module.exports = { loop };


/**
 * The generic loop.
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
function loop(before, action, after, initialResult, counter = 1) {
    const thenWrap = (func, result) => Promise.resolve().then(_ => func(result, counter));

    const runNext = curResult => loop(before, action, after, curResult, counter + 1);

    const runAfter = curResult => after
        ? thenWrap(after, curResult)
            .then(ok => ok ? runNext(curResult) : curResult, _ => curResult)
        : runNext(curResult);

    const runAction = prevResult => action(prevResult, counter)
        .then(runAfter);

    return before
        ? thenWrap(before, initialResult)
            .then(ok => ok ? runAction(initialResult) : initialResult, _ => initialResult)
        : runAction(initialResult);
}


