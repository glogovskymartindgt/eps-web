import { expect } from 'chai';
import 'mocha';
import { TimeUtils } from './time.utils';

describe('TimeUtils', () => {
    describe('GetDurationInMinutes', () => {
        it('It should return diff in minutes', () => {
            expect(TimeUtils.getDurationInMinutes('12:00', '13:00')).to.be.equal(60);
            expect(TimeUtils.getDurationInMinutes('13:00', '12:00')).to.be.equal(-60);
            expect(TimeUtils.getDurationInMinutes('13:00', '13:00')).to.be.equal(0);
        });
    });
});
