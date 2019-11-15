import { expect } from 'chai';
import 'mocha';
import { TimeUtils } from './time.utils';

describe('TimeUtils', () => {
    describe('GetDurationInMinutes', () => {
        it('It should return diff in minutes', () => {
            const hourDifferenceInMinutes = 60;
            const negativeHourDifferenceInMinutes = -60;
            const noDifference = 0;
            expect(TimeUtils.getDurationInMinutes('12:00', '13:00'))
                .to
                .be
                .equal(hourDifferenceInMinutes);
            expect(TimeUtils.getDurationInMinutes('13:00', '12:00'))
                .to
                .be
                .equal(negativeHourDifferenceInMinutes);
            expect(TimeUtils.getDurationInMinutes('13:00', '13:00'))
                .to
                .be
                .equal(noDifference);
        });
    });
});
