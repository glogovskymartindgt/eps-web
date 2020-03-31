import { VenuePipe } from './venue.pipe';

describe('VenuePipe', (): void => {
    it('create an instance', (): void => {
        const pipe = new VenuePipe();
        expect(pipe)
            .toBeTruthy();
    });
});
