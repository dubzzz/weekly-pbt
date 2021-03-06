import fc from 'fast-check';
import { fibonacci } from './005-fibonacci';

// The complexity of the algorithm is O(n)
// so we limit the number generators to small ranges (compared to their default)
const MaxN = 1000;

describe('005-fibonacci', () => {
  it('should be equal to the sum of fibo(n-1) and fibo(n-2)', () => {
    fc.assert(
      fc.property(fc.integer(2, MaxN), (n) => {
        expect(fibonacci(n)).toBe(fibonacci(n - 1) + fibonacci(n - 2));
      })
    );
  });

  // The following properties are listed on the Wikipedia page:
  // https://fr.wikipedia.org/wiki/Suite_de_Fibonacci#Divisibilit%C3%A9_des_nombres_de_Fibonacci

  it('should fulfill fibo(p)*fibo(q+1)+fibo(p-1)*fibo(q) = fibo(p+q)', () => {
    fc.assert(
      fc.property(fc.integer(1, MaxN), fc.integer(0, MaxN), (p, q) => {
        expect(fibonacci(p + q)).toBe(fibonacci(p) * fibonacci(q + 1) + fibonacci(p - 1) * fibonacci(q));
      })
    );
  });

  it('should fulfill fibo(2p-1) = fibo²(p-1)+fibo²(p)', () => {
    // Special case of the property above
    fc.assert(
      fc.property(fc.integer(1, MaxN), (p) => {
        expect(fibonacci(2 * p - 1)).toBe(fibonacci(p - 1) * fibonacci(p - 1) + fibonacci(p) * fibonacci(p));
      })
    );
  });

  it('should fulfill Catalan identity', () => {
    fc.assert(
      fc.property(fc.integer(0, MaxN), fc.integer(0, MaxN), (a, b) => {
        const [p, q] = a < b ? [b, a] : [a, b];
        const sign = (p - q) % 2 === 0 ? 1n : -1n; // (-1)^(p-q)
        expect(fibonacci(p) * fibonacci(p) - fibonacci(p - q) * fibonacci(p + q)).toBe(
          sign * fibonacci(q) * fibonacci(q)
        );
      })
    );
  });

  it('should fulfill Cassini identity', () => {
    fc.assert(
      fc.property(fc.integer(1, MaxN), fc.integer(0, MaxN), (p) => {
        const sign = p % 2 === 0 ? 1n : -1n; // (-1)^p
        expect(fibonacci(p + 1) * fibonacci(p - 1) - fibonacci(p) * fibonacci(p)).toBe(sign);
      })
    );
  });

  it('should fibo(nk) divisible by fibo(n)', () => {
    fc.assert(
      fc.property(fc.integer(1, MaxN), fc.integer(0, 100), (n, k) => {
        expect(fibonacci(n * k) % fibonacci(n)).toBe(0n);
      })
    );
  });

  it('should fulfill gcd(fibo(a), fibo(b)) = fibo(gcd(a,b))', () => {
    fc.assert(
      fc.property(fc.integer(1, MaxN), fc.integer(1, MaxN), (a, b) => {
        const gcdAB = Number(gcd(BigInt(a), BigInt(b)));
        expect(gcd(fibonacci(a), fibonacci(b))).toBe(fibonacci(gcdAB));
      })
    );
  });
});

// Helpers

function gcd(_a: bigint, _b: bigint): bigint {
  let a = _a < 0n ? -_a : _a;
  let b = _b < 0n ? -_b : _b;
  if (b > a) {
    const temp = a;
    a = b;
    b = temp;
  }
  while (true) {
    if (b === 0n) return a;
    a = a % b;
    if (a === 0n) return b;
    b = b % a;
  }
}
