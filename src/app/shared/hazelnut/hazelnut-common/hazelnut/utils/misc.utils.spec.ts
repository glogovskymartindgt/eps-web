import { expect } from 'chai';
import { MiscUtils } from './misc.utils';

const error = 'simple.error';
const errorTimeout = 'error.timeout';

describe('MiscUtils', () => {
    describe('getErrorMessage', () => {
        it('Returns text from error', () => {
            expect(MiscUtils.getErrorMessage(error))
                .to
                .be
                .equal(error);
            expect(MiscUtils.getErrorMessage({message: error}))
                .to
                .be
                .equal(error);
            expect(MiscUtils.getErrorMessage({error: {message: error}}))
                .to
                .be
                .equal(error);

            expect(MiscUtils.getErrorMessage('timeout'))
                .to
                .be
                .equal(errorTimeout);
            expect(MiscUtils.getErrorMessage({message: 'timeout'}))
                .to
                .be
                .equal(errorTimeout);
            expect(MiscUtils.getErrorMessage({error: {message: 'timeout'}}))
                .to
                .be
                .equal(errorTimeout);
        });
    });
});
