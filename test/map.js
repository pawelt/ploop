const { expect, sinon, expectDelayWithin } = require('./common');
const { mapSer, mapCon, delay } = require('../lib/prut');

const syncMap1 = [ 1, 2, 3, 4, 5 ];
const asyncMap1 = [ Promise.resolve(1), Promise.resolve(2), 3, 4, Promise.resolve(5) ];
const resultMap1 = [ 2, 4, 6, 8, 10 ];
const resultMapFirstAndThirdElem = [ 2, , 6, 8, 10 ];
const resultMapOnlyFirstElem = [ 2 ];

const syncMapper = (v, i, m) => v * 2;
const fastAsyncMapper = (v, i, m) => delay(10).then(_ => v * 2);
const slowAsyncMapper = (v, i, m) => delay(100).then(_ => v * 2);
const failingMapper = (v, i, m) => delay(10).then(_ => i != 1 ? v * 2 : Promise.reject(v * 2));


describe('mapSer', function () {

    this.slow(200);

    it('should map values serially with synchronous mapper', () => {
        return expect(mapSer(syncMap1, syncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map values serially with asynchronous mapper', () => {
        return expect(mapSer(syncMap1, fastAsyncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map mixed values (simple and promised)', () => {
        return expect(mapSer(asyncMap1, syncMapper))
            .to.eventually.eql(resultMap1);
    });

    it('should map remaining elements after an element mapping failure', () => {
        return expect(mapSer(asyncMap1, failingMapper, false))
            .to.eventually.eql(resultMapFirstAndThirdElem);
    });

    it('should stop mapping after first failed mapping attempt', () => {
        return expect(mapSer(asyncMap1, failingMapper, true))
            .to.eventually.be.rejected
            .and.be.eql(resultMapOnlyFirstElem);
    });


});


describe('mapCon', function () {

    this.slow(500);

    it('should map all values concurrently', () => {
        return expect(mapCon(asyncMap1, slowAsyncMapper, false))
            .to.eventually.be.eql(resultMap1)
            .then(expectDelayWithin(100, 150));
    });

    it('should map all values running 3 mappers concurrently', () => {
        // 5 values mapped by 3 instances each taking 100ms -> ~200ms in total
        return expect(mapCon(asyncMap1, slowAsyncMapper, false, 3))
            .to.eventually.eql(resultMap1)
            .then(expectDelayWithin(200, 250));
    });

});
