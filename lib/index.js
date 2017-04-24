const { delay, delayResolve, delayReject } = require('./delay');
const { loop } = require('./loop');
const { whileDo, doWhile } = require('./while');
const { retry } = require('./retry');
const { mapSer, mapCon } = require('./map');

module.exports = {
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
