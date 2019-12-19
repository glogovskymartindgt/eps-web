import { VenuePipe } from './venue.pipe';

describe('VenuePipe', () => {
    it('create an instance', () => {
        const pipe = new VenuePipe();
        expect(pipe)
            .toBeTruthy();
    });
});
