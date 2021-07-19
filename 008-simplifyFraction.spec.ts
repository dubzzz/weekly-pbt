import fc from 'fast-check';
import 'jest-extended';
import { simplifyFraction } from './008-simplifyFraction';

describe('008-simplifyFraction', () => {
  it('should simplify any fraction to a fraction having the same result', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer().filter((n) => n !== 0),
        (numerator, denominator) => {
          const fSource = { numerator, denominator };
          const fOut = simplifyFraction(fSource);
          expect(fOut.numerator / fOut.denominator).toEqual(fSource.numerator / fSource.denominator);
        }
      )
    );
  });

  it('should always return a simplified fraction having a positive denominator', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer().filter((n) => n !== 0),
        (numerator, denominator) => {
          const fSource = { numerator, denominator };
          const fOut = simplifyFraction(fSource);
          expect(fOut.denominator).toBeGreaterThan(0);
        }
      )
    );
  });

  it('should only produce integer values for the numerator and denominator', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer().filter((n) => n !== 0),
        (numerator, denominator) => {
          const fSource = { numerator, denominator };
          const fOut = simplifyFraction(fSource);
          expect(fOut.numerator).toSatisfy(Number.isInteger);
          expect(fOut.denominator).toSatisfy(Number.isInteger);
        }
      )
    );
  });

  it('should simplify fractions to simpler form whenever possible', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer().filter((n) => n !== 0),
        fc.integer({ min: 1 }),
        (smallNumerator, smallDenominator, factor) => {
          fc.pre(Math.abs(smallNumerator * factor) <= Number.MAX_SAFE_INTEGER);
          fc.pre(Math.abs(smallDenominator * factor) <= Number.MAX_SAFE_INTEGER);

          const fSource = { numerator: smallNumerator * factor, denominator: smallDenominator * factor };
          const fOut = simplifyFraction(fSource);

          expect(Math.abs(fOut.numerator)).toBeLessThanOrEqual(Math.abs(smallNumerator));
          expect(Math.abs(fOut.denominator)).toBeLessThanOrEqual(Math.abs(smallDenominator));
        }
      )
    );
  });
});
