import fc from 'fast-check';
import 'jest-extended';
import { respace } from './003-respace';

const alphaCharArb = fc.integer({ min: 'a'.charCodeAt(0), max: 'z'.charCodeAt(0) }).map((v) => String.fromCharCode(v));
const wordArb = fc.stringOf(alphaCharArb, { minLength: 1 });

describe('003-respace', () => {
  it('should be able to find back the original message', () => {
    fc.assert(
      fc.property(
        fc.set(wordArb, { minLength: 1 }).chain((words) =>
          fc.record({
            words: fc.constant(words),
            originalMessage: fc.array(fc.constantFrom(...words)).map((items) => items.join(' ')),
          })
        ),
        ({ words, originalMessage }) => {
          const spacelessMessage = originalMessage.replace(/\s/g, '');
          const combinations = respace(spacelessMessage, words);
          expect(combinations).toContain(originalMessage);
        }
      )
    );
  });

  it('should only return messages with spaceless version being the passed message', () => {
    fc.assert(
      fc.property(
        fc.set(wordArb, { minLength: 1 }).chain((words) =>
          fc.record({
            words: fc.shuffledSubarray(words), // we potentially remove words from the dictionary to cover no match case
            originalMessage: fc.array(fc.constantFrom(...words)).map((items) => items.join(' ')),
          })
        ),
        ({ words, originalMessage }) => {
          const spacelessMessage = originalMessage.replace(/\s/g, '');
          const combinations = respace(spacelessMessage, words);
          for (const combination of combinations) {
            expect(combination.replace(/\s/g, '')).toBe(spacelessMessage);
          }
        }
      )
    );
  });

  it('should only return messages built from words coming from the set of words', () => {
    fc.assert(
      fc.property(
        fc.set(wordArb, { minLength: 1 }).chain((words) =>
          fc.record({
            words: fc.shuffledSubarray(words), // we potentially remove words from the dictionary to cover no match case
            originalMessage: fc.array(fc.constantFrom(...words)).map((items) => items.join(' ')),
          })
        ),
        ({ words, originalMessage }) => {
          const spacelessMessage = originalMessage.replace(/\s/g, '');
          const combinations = respace(spacelessMessage, words);
          for (const combination of combinations) {
            if (combination.length !== 0) {
              expect(words).toIncludeAnyMembers(combination.split(' '));
            }
          }
        }
      )
    );
  });
});
