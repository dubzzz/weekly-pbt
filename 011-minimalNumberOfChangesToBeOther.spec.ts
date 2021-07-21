import fc from 'fast-check';
import { minimalNumberOfChangesToBeOther } from './011-minimalNumberOfChangesToBeOther';

type Change =
  | { type: 'no-op'; value: string }
  | { type: 'new'; value: string }
  | { type: 'delete'; value: string }
  | { type: 'update'; from: string; to: string };

const changeArb = fc.array(
  fc.oneof(
    fc.record<Change>({ type: fc.constant('no-op'), value: fc.fullUnicode() }),
    fc.record<Change>({ type: fc.constant('new'), value: fc.fullUnicode() }),
    fc.record<Change>({ type: fc.constant('delete'), value: fc.fullUnicode() }),
    fc.record<Change>({ type: fc.constant('update'), from: fc.fullUnicode(), to: fc.fullUnicode() })
  ),
  { minLength: 1 }
);

describe('011-minimalNumberOfChangesToBeOther', () => {
  it('should compute the return the minimal number of changes to mutate before into after', () => {
    fc.assert(
      fc.property(changeArb, (changes) => {
        // Arrange
        const before = beforeFromChanges(changes);
        const after = afterFromChanges(changes);

        // Act
        const numChanges = minimalNumberOfChangesToBeOther(before, after);

        // Assert
        expect(numChanges).toBeLessThanOrEqual(countRequestedOperations(changes));
      })
    );
  });

  it('should never request any changes when moving a string to itself', () => {
    fc.assert(
      fc.property(fc.fullUnicodeString(), (value) => {
        // Arrange / Act
        const numChanges = minimalNumberOfChangesToBeOther(value, value);

        // Assert
        expect(numChanges).toBe(0);
      })
    );
  });

  it('should be independent of the ordering of the arguments', () => {
    fc.assert(
      fc.property(changeArb, (changes) => {
        // Arrange
        const before = beforeFromChanges(changes);
        const after = afterFromChanges(changes);

        // Act
        const numChanges = minimalNumberOfChangesToBeOther(before, after);
        const numChangesReversed = minimalNumberOfChangesToBeOther(after, before);

        // Assert
        expect(numChangesReversed).toBe(numChanges);
      })
    );
  });
});

// Helpers

function countRequestedOperations(changes: Change[]): number {
  return changes.filter((d) => d.type !== 'no-op').length;
}
function beforeFromChanges(changes: Change[]): string {
  let value = '';
  for (const c of changes) {
    if (c.type === 'no-op') value += c.value;
    else if (c.type === 'delete') value += c.value;
    else if (c.type === 'update') value += c.from;
  }
  return value;
}
function afterFromChanges(changes: Change[]): string {
  let value = '';
  for (const c of changes) {
    if (c.type === 'no-op') value += c.value;
    else if (c.type === 'new') value += c.value;
    else if (c.type === 'update') value += c.to;
  }
  return value;
}
