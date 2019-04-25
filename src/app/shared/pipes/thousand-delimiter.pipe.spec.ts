import { ThousandDelimiterPipe } from './thousand-delimiter.pipe';

describe('ThousandDelimiterPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandDelimiterPipe();
    expect(pipe).toBeTruthy();
  });
});
