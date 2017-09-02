const { expect, expectDelay, expectDelayWithin, slow, timeout } = require('./common');
const { map, delay } = require('../lib');

const syncMap1 = [ 1, 2, 3, 4, 5 ];
const asyncMap1 = [ Promise.resolve(1), Promise.resolve(2), 3, 4, Promise.resolve(5) ];
const resultMap1 = [ 2, 4, 6, 8, 10 ];
const resultMapFirstAndThirdElem = [ 2, , 6, 8, 10 ];
const resultMapOnlyFirstElem = [ 2 ];

const syncMapper = (v, i, m) => v * 2;
const fastAsyncMapper = (v, i, m) => delay(10).then(_ => v * 2);
const slowAsyncMapper = (v, i, m) => delay(100).then(_ => v * 2);
const slowestAsyncMapper = (v, i, m) => delay(1000).then(_ => console.log('DONE') || v * 2);
const fastFailingMapper = (v, i, m) => delay(10).then(_ => i != 1 ? v * 2 : Promise.reject(v * 2));
const slowFailingMapper = (v, i, m) => delay(100).then(_ => i != 1 ? v * 2 : Promise.reject(v * 2));
const slowRandomFailingMapper = (v, i, m) => delay(100).then(_ => i != 1 ? v * 2 : (Math.random() > .5 ? Promise.reject(v * 2) : v * 2));


describe('map - serial', function () {

    slow(this, 200);

    it('should map values serially with synchronous mapper', () => {
        return expect(map(syncMap1, syncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map values serially with asynchronous mapper', () => {
        return expect(map(syncMap1, fastAsyncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map mixed values (simple and promised)', () => {
        return expect(map(asyncMap1, syncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map remaining elements after an element mapping failure', () => {
        return expect(map(asyncMap1, fastFailingMapper, false).catch(x => x))
            .to.eventually.eql(resultMapFirstAndThirdElem);
    });

    it('should stop mapping after first failed mapping attempt', () => {
        return expect(map(asyncMap1, fastFailingMapper, true))
            .to.eventually.be.rejected
            .and.be.eql(resultMapOnlyFirstElem);
    });


});


describe('map - concurrent', function () {

    slow(this, 500);
    timeout(this, 10000);

    it('should map all values concurrently', () => {
        return expect(map(asyncMap1, slowAsyncMapper, false, 123456789))
            .to.eventually.be.eql(resultMap1)
            .then(expectDelayWithin(100, 150));
    });

    it('should map all values running 3 mappers concurrently', () => {
        // 5 values mapped by 3 instances each taking 100ms -> ~200ms in total
        return expect(map(asyncMap1, slowAsyncMapper, false, 3))
            .to.eventually.eql(resultMap1)
            .then(expectDelayWithin(200, 250));
    });

});
