import fc from 'fast-check';
import { fizzbuzz } from './007-fizzbuzz';

describe('006-fizzbuzz', () => {
  it('should print Fizz whenever divisible by 3', () => {
    fc.assert(
      fc.property(
        fc.nat().map((n) => n * 3),
        (n) => {
          expect(fizzbuzz(n)).toContain('Fizz');
        }
      )
    );
  });

  it('should not print Fizz when not divisible by 3', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.nat().map((n) => n * 3 + 1),
          fc.nat().map((n) => n * 3 + 2)
        ),
        (n) => {
          expect(fizzbuzz(n)).not.toContain('Fizz');
        }
      )
    );
  });

  it('should only print Fizz when divisible by 3 but not by 5', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc
            .nat()
            .map((n) => n * 5 + 1)
            .map((n) => n * 3),
          fc
            .nat()
            .map((n) => n * 5 + 2)
            .map((n) => n * 3),
          fc
            .nat()
            .map((n) => n * 5 + 3)
            .map((n) => n * 3),
          fc
            .nat()
            .map((n) => n * 5 + 4)
            .map((n) => n * 3)
        ),
        (n) => {
          expect(fizzbuzz(n)).toBe('Fizz');
        }
      )
    );
  });

  it('should print Buzz whenever divisible by 5', () => {
    fc.assert(
      fc.property(
        fc.nat().map((n) => n * 5),
        (n) => {
          expect(fizzbuzz(n)).toContain('Buzz');
        }
      )
    );
  });

  it('should not print Buzz when not divisible by 5', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.nat().map((n) => n * 5 + 1),
          fc.nat().map((n) => n * 5 + 2),
          fc.nat().map((n) => n * 5 + 3),
          fc.nat().map((n) => n * 5 + 4)
        ),
        (n) => {
          expect(fizzbuzz(n)).not.toContain('Buzz');
        }
      )
    );
  });

  it('should only print Buzz when divisible by 5 but not by 3', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc
            .nat()
            .map((n) => n * 3 + 1)
            .map((n) => n * 5),
          fc
            .nat()
            .map((n) => n * 3 + 2)
            .map((n) => n * 5)
        ),
        (n) => {
          expect(fizzbuzz(n)).toBe('Buzz');
        }
      )
    );
  });

  it('should print Fizz Buzz whenever divisible by 3 and 5', () => {
    fc.assert(
      fc.property(
        fc
          .nat()
          .map((n) => n * 3)
          .map((n) => n * 5),
        (n) => {
          expect(fizzbuzz(n)).toBe('Fizz Buzz');
        }
      )
    );
  });

  it('should print the value itself when not divisible by 3 and not divisible by 5', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.nat().map((n) => n * 15 + 1),
          fc.nat().map((n) => n * 15 + 2),
          fc.nat().map((n) => n * 15 + 4), // +3 would be divisible by 3
          fc.nat().map((n) => n * 15 + 7), // +5 would be divisible by 5, +6 would be divisible by 3
          fc.nat().map((n) => n * 15 + 8), // +9 would be divisible by 3, +10 would be divisible by 5
          fc.nat().map((n) => n * 15 + 11),
          fc.nat().map((n) => n * 15 + 13), // +12 would be divisible by 3
          fc.nat().map((n) => n * 15 + 14)
        ),
        (n) => {
          expect(fizzbuzz(n)).toBe(String(n));
        }
      )
    );
  });
});
