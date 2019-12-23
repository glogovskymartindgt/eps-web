import { expect } from 'chai';
import { MathUtils } from './math.utils';

describe('MathUtils', () => {
    describe('roundToDecimals', () => {
        it('Returns decimal number rounded off to N decimal places', () => {
            const testValue = 1.23456;
            expect(MathUtils.roundToDecimals(testValue))
                .to
                .be
                .equal('1.23');
        });
    });
});
