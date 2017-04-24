const chai = require('chai')
    .use(require("chai-as-promised"))
    .use(require("sinon-chai"));
const expect = chai.expect;
const sinon = require('sinon');

const expectDelay = (millis, start = Date.now()) => _ => expect(Date.now() - start).to.be.above(millis - 10);
const expectDelayWithin = (millisFrom, millisTo = millisFrom, start = Date.now()) => _ => expect(Date.now() - start).to.be.within(millisFrom - 10, millisTo + 10);

module.exports = {
    chai,
    expect,
    sinon,

    expectDelay,
    expectDelayWithin,
};
