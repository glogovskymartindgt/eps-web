import { expect } from 'chai';
import { MathUtils } from './math.utils';

describe('MathUtils', () => {
    describe('roundToDecimals', () => {
        it('Returns decimal number rounded off to N decimal places', () => {
            expect(MathUtils.roundToDecimals(1.23456)).to.be.equal('1.23');
        });
    });
});
