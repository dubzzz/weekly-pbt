import fc from 'fast-check';
import { lastIndexOf } from './002-lastIndexOf';

describe('002-lastIndexOf', () => {
  it('should detect a substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const searchString = b;
        const text = `${a}${b}${c}`;
        expect(lastIndexOf(searchString, text)).not.toBe(-1);
      })
    );
  });

  it('should return the start index of the substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const searchString = b;
        const text = `${a}${b}${c}`;
        const index = lastIndexOf(searchString, text);
        expect(text.substr(index, searchString.length)).toBe(searchString);
      })
    );
  });

  it('should return the last possible index of the substring when there is one', () => {
    fc.assert(
      fc.property(fc.string(), fc.string({ minLength: 1 }), fc.string(), (a, b, c) => {
        const searchString = b;
        const text = `${a}${b}${c}`;
        const textBis = text.substring(lastIndexOf(searchString, text) + 1);
        expect(lastIndexOf(searchString, textBis)).toBe(-1);
      })
    );
  });
});
