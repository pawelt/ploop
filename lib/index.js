const { delay, delayResolve, delayReject } = require('./delay');
const { loop } = require('./loop');
const { whileDo, doWhile } = require('./while');
const { retry } = require('./retry');
const { map } = require('./map');

module.exports = {
    delayResolve,
    delayReject,
    delay,

    loop,

    whileDo,
    doWhile,

    retry,

    map,
};
