const { loop  } = require('./loop');

module.exports = { map };


/**
 * Map serially or concurrently.
 * By default, concurrency is set to one, so mapping happens in series.
 *
 * @param {array} collection
 * @param {function} mapper
 * @param {boolean} [breakEarly = false] stop on first mapping error
 * @param {number} [concurrency = 1] pass 2+ to run concurrent version of map
 */
function map(collection, mapper, breakEarly = false, concurrency = 1) {
    const state = {
        result: [],
        index: 0,
        failed: false,
        done: false,
        breakEarly,
    };
    const doMap = _ => mapInternal(collection, mapper, state);
    const length = Math.min(concurrency, collection.length);

    const promises = concurrency < 2
        ? doMap()
        : Promise.all(Array.apply(null, { length }).map(doMap));

    return promises
        .then(res => state.failed ? Promise.reject(state.result) : state.result);
}


function mapInternal(collection, mapper, state) {
    const before = (res, counter) => !state.done && state.index < collection.length;

    const wrappedMapper = (res, counter) => {
        // use shared index to allow concurrent execution
        const i = state.index++;

        // make sure other mappers didn't drain the items to map
        if (i >= collection.length) return Promise.resolve(state);

        return Promise.resolve(collection[i])
            .then(v => mapper(v, i, collection))
            .then(v => {
                state.result[i] = v;
                return state;
            })
            .catch(_ => {
                state.failed = true;
                state.done = !!state.breakEarly;
                return state;
            })
    };

    return loop(before, wrappedMapper, null, state);
}



