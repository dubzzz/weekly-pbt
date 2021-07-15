import fc from 'fast-check';
import { sorted } from './001-sorted';

describe('001-sorted', () => {
  it('should have the same length as source', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        expect(sorted(data)).toHaveLength(data.length);
      })
    );
  });

  it('should have exactly the same number of occurences as source for each item', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        const sortedData = sorted(data);
        expect(countEach(sortedData)).toEqual(countEach(data));
      })
    );
  });

  it('should produce an ordered array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        const sortedData = sorted(data);
        for (let idx = 1; idx < sortedData.length; ++idx) {
          expect(sortedData[idx - 1]).toBeLessThanOrEqual(sortedData[idx]);
        }
      })
    );
  });
});

// Helpers

function countEach(data: unknown[]): Map<unknown, number> {
  const counter = new Map<unknown, number>();
  for (const item of data) {
    const currentCount = counter.get(item) || 0;
    counter.set(item, currentCount + 1);
  }
  return counter;
}
