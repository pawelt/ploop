const chai = require('chai')
    .use(require("chai-as-promised"))
    .use(require("sinon-chai"));
const expect = chai.expect;
const sinon = require('sinon');

const expectDelay = (millis, start = Date.now()) => _ => expect(Date.now() - start).to.be.above(millis - 10);
const expectDelayWithin = (millisFrom, millisTo = millisFrom, start = Date.now()) => _ => expect(Date.now() - start).to.be.within(millisFrom - 10, millisTo + 10);

// jest compatibility
function slow(t, v) { (t.tests || t.test) && t.slow(v); }
function timeout(t, v) { (t.tests || t.test) && t.timeout(v); }
describe('', () => { it('', () => {}) });


module.exports = {
    chai,
    expect,
    sinon,

    slow,
    timeout,

    expectDelay,
    expectDelayWithin,
};
