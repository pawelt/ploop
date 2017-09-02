const { expect, sinon, expectDelay, slow } = require('./common');
const { retry } = require('../lib');


const RESOLVED_SUCCESS = 'YES!';

const resolveOnThirdCall = (total = 1) => total < 3
    ? Promise.reject(total + 1)
    : Promise.resolve(RESOLVED_SUCCESS);

const trueNTimes = times => sinon.spy((res, counter) => counter < times);

const expectConditions = (opts, beforeCount = -1, afterCount = -1) => () => {
    beforeCount > -1 && expect(opts.before, 'before').to.have.callCount(beforeCount);
    afterCount > -1 && expect(opts.after, 'after').to.have.callCount(afterCount);
};


describe('retry', function () {

    it('should reject when last attempt fails', () => {
        const actionSpy = sinon.spy(resolveOnThirdCall);
        return expect(retry(2, actionSpy))
            .to.eventually.be.rejected
            .then(() => expect(actionSpy).to.have.callCount(2));
    });

    it('should resolve to successful attempt result', () => {
        return expect(retry(3, resolveOnThirdCall))
            .to.eventually.be.equal(RESOLVED_SUCCESS);
    });

    it('should call before and after functions', function () {
        slow(this, 500);
        const opts = { backoff: 100, before: trueNTimes(10), after: trueNTimes(10) };
        return expect(retry(opts, resolveOnThirdCall))
            .to.eventually.be.fulfilled
            .then(expectConditions(opts, 3, 2))
            .then(expectDelay(2 * 100));
    });

    it('should reject when before condition returns false', () => {
        const opts = { before: trueNTimes(1), after: trueNTimes(1) };
        return expect(retry(opts, resolveOnThirdCall))
            .to.eventually.be.rejected
            .then(expectConditions(opts, 1, 0));
    });

    it('should reject when after condition returns false', () => {
        const opts = { before: trueNTimes(10), after: trueNTimes(1)  };
        return expect(retry(opts, resolveOnThirdCall))
            .to.eventually.be.rejected
            .then(expectConditions(opts, 1, 1));
    });

});


