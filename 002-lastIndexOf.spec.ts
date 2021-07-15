import fc from 'fast-check';
import { lastIndexOf } from './002-lastIndexOf';

describe('002-lastIndexOf', () => {
  it('should detect a substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const pattern = b;
        const text = `${a}${b}${c}`;
        expect(lastIndexOf(pattern, text)).not.toBe(-1);
      })
    );
  });

  it('should return the start index of the substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const pattern = b;
        const text = `${a}${b}${c}`;
        const index = lastIndexOf(pattern, text);
        expect(text.substr(index, pattern.length)).toBe(pattern);
      })
    );
  });

  it('should return the last possible index of the substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string({ minLength: 1 }), fc.string(), (a, b, c) => {
        const pattern = b;
        const text = `${a}${b}${c}`;
        const textBis = text.substring(lastIndexOf(pattern, text) + 1);
        expect(lastIndexOf(pattern, textBis)).toBe(-1);
      })
    );
  });
});
