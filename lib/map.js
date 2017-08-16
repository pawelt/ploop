const { loop  } = require('./loop');

module.exports = { mapSer, mapCon };


/**
 * Map serially.
 * 
 * @param {array} collection 
 * @param {function} mapper 
 * @param {boolean} [breakEarly = false] 
 */
function mapSer(collection, mapper, breakEarly = false) {
    return mapInternal(collection, mapper, makeMapState({ breakEarly }));
}


/**
 * Map concurrently.
 * 
 * @param {array} collection
 * @param {function} mapper 
 * @param {boolean} [breakEarly = false]
 * @param {number} [concurrency = Infinite]
 */
function mapCon(collection, mapper, breakEarly = false, concurrency = 1234567890) {
    const state = makeMapState({ breakEarly });
    const length = Math.min(concurrency, collection.length);

    const promises = Array.apply(null, { length })
        .map(_ => mapInternal(collection, mapper, state));

    return Promise.all(promises)
        .then(_ => state.result, _ => Promise.reject(state.result));
}


function makeMapState(opts = {}) {
    return Object.assign({}, {
        result: [],
        failed: false,
        index: 0,
        done: false,
        breakEarly: false,
    }, opts);

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
                if (!state.done) {
                    state.result[i] = v;
                    state.failed = false;
                }
                return state;
            })
            .catch(_ => {
                if (!state.done) {
                    state.failed = true;
                }
                state.done = !!state.breakEarly;
                return state;
            })
    };

    return loop(before, wrappedMapper, null, state)
        .then(res => state.failed
            ? Promise.reject(state.result)
            : Promise.resolve(state.result)
        );
}



