import { ThousandDelimiterPipe } from './thousand-delimiter.pipe';

describe('ThousandDelimiterPipe', (): void => {
    it('create an instance', (): void => {
        const pipe = new ThousandDelimiterPipe();
        expect(pipe)
            .toBeTruthy();
    });
});
