const Promise = require('bluebird');

const { delayResolve } = require('./delay');
const { loop } = require('./loop');

module.exports = { retry };


/**
 * Retry.
 *
 * @param opts
 * @param action
 * @param initialResult
 * @returns {Promise.<TResult>}
 */
function retry(opts, action, initialResult) {
    const limit = !isNaN(opts) ? opts : (opts.limit >= 0 ? opts.limit : -1);
    const backoff = !isNaN(opts.backoff) ? delayResolve(opts.backoff) : opts.backoff;
    const { before, after } = opts;

    const callOrTrue = (func, res, counter) => !func || func(res, counter);

    const runAfter = (res, counter) => res.failed
        && Promise.resolve(callOrTrue(after, res, counter))
            .then(ok => ok && callOrTrue(backoff, res, counter));

    const runAction = (res, counter) => action(res.result, counter)
        .then(result => ({ result, failed: false }))
        .catch(result => ({ result, failed: true }));

    const runBefore = (res, counter) => res.failed
        && (limit < 0 || counter <= limit)
        && callOrTrue(before, res, counter);

    return loop(runBefore, runAction, runAfter, { result: initialResult, failed: true })
        .then(res => res.failed
            ? Promise.reject(res.result)
            : Promise.resolve(res.result)
        );
}


