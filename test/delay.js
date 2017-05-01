const { expect, expectDelay } = require('./common');
const { delayResolve, delayReject, delay } = require('../lib');


const SLOW_THRESHOLD = 400;
const MILLIS = 100;


describe('delay', function () {

    this.slow(SLOW_THRESHOLD);

    it('should resolve to a specified value after N milliseconds', () => {
        const p = delay(MILLIS, 123);
        return expect(p).to.eventually.be.equal(123).then(expectDelay(MILLIS));
    });

});


describe('delayResolve', function () {

    this.slow(SLOW_THRESHOLD);

    it('should return a function that resolves after N milliseconds', () => {
        const p = delayResolve(MILLIS)();
        return expect(p).to.eventually.be.fulfilled.then(expectDelay(MILLIS));
    });

    it('should return a function that resolves with the upstream result', () => {
        const res = 'It works!';
        const p = Promise.resolve(res).then(delayResolve(10));
        return expect(p).to.eventually.equal(res);
    });

});


describe('delayReject', function () {

    this.slow(SLOW_THRESHOLD);

    it('should return a function that rejects after N milliseconds', () => {
        const p = delayReject(MILLIS)();
        return expect(p).to.eventually.be.rejected.then(expectDelay(MILLIS));

    });

    it('should return a function that rejects with the upstream error', () => {
        const err = new Error('some error');
        const p = Promise.reject(err).catch(delayReject(10));
        return expect(p).to.eventually.be.rejectedWith(err.message);
    });

});

