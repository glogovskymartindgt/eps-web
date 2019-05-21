import { expect } from 'chai';
import 'mocha';
import { MockData } from '../others/mock-data';
import { StringUtils } from './string.utils';

describe('StringUtils', () => {
    const testString = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž';
    const resultString = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';

    describe('Join', () => {
        it('It should join string by delimiter and append prefix and postfix', () => {
            const notArray: any[] | any = 'Jean-Claude Van Damme';
            const testCase = ['hello', 'my', 'world'];
            expect(StringUtils.join(notArray, '///', '<<', '>>')).to.equal(`<<${notArray}>>`);
            expect(StringUtils.join(testCase, ' ', '<<', '>>')).to.equal('<<hello my world>>');
            expect(StringUtils.join([], '-', '<<', '>>')).to.equal('<<>>');
            expect(StringUtils.join([], '/')).to.equal('');
        });
    });
    describe('RemoveAccented', () => {
        const notString: string | any = 23;
        const finalTestString = testString + testString.toUpperCase();
        const finalResultString = resultString + resultString.toUpperCase();
        it('It should remove accented characters from string', () => {
            expect(StringUtils.removeAccentedCharacters(finalTestString)).to.be.equal(finalResultString);
            expect(StringUtils.removeAccentedCharacters(finalResultString)).to.be.equal(finalResultString);
            expect(StringUtils.removeAccentedCharacters(MockData.characters)).to.be.equal(MockData.characters);
            expect(StringUtils.removeAccentedCharacters(notString)).to.equal(notString);
        });
    });

    describe('GetLastPart', () => {
        it('It should return last part of string divided by delimiter', () => {
            expect(StringUtils.getLastPart('ababababa', 'b')).to.be.equal('a');
            expect(StringUtils.getLastPart('ababababaa', 'b')).to.be.equal('aa');
            expect(StringUtils.getLastPart('i am here')).to.be.equal('here');
            expect(StringUtils.getLastPart('i ambhere', 'b')).to.be.equal('here');
            expect(StringUtils.getLastPart('', '')).to.be.equal('');
            expect(StringUtils.getLastPart('')).to.be.equal('');

        });
    });
    describe('IsValidPhoneNumber', () => {
        it('It should return true if phone number is valid', () => {
            [
                ...MockData.randomStrings,
                ...MockData.emails,
            ].forEach((num) => {
                expect(StringUtils.isValidPhoneNumber(num), `'${num}' should not be phone number`).to.be.false;
            });

            MockData.phoneNumbers.forEach((num) => {
                expect(StringUtils.isValidPhoneNumber(num), `'${num}' should be phone number`).to.be.true;
            });
        });
    });
});
