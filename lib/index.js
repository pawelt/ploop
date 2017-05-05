const { setPromise, getPromise } = require('./promise-impl');
const { delay, delayResolve, delayReject } = require('./delay');
const { loop } = require('./loop');
const { whileDo, doWhile } = require('./while');
const { retry } = require('./retry');
const { mapSer, mapCon } = require('./map');


function usePromise(promiseImpl) {
    setPromise(promiseImpl);
    return this;
}


const exp = {
    usePromise,
    getPromise,

    delayResolve,
    delayReject,
    delay,

    loop,

    whileDo,
    doWhile,

    retry,

    mapSer,
    mapCon,
};


module.exports = exp;
