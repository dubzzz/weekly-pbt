import fc from 'fast-check';
import { DiffLine, textDiffer } from './010-textDiffer';

const diffArb = fc.array(
  fc.record<DiffLine>({
    type: fc.constantFrom('addition', 'deletion', 'unchanged'),
    content: fc.hexaString(),
  }),
  { minLength: 1 }
);

describe('010-textDiffer', () => {
  it('should be able to rebuild before given only the diff', () => {
    fc.assert(
      fc.property(diffArb, (diff) => {
        // Arrange
        const before = beforeFromDiff(diff);
        const after = afterFromDiff(diff);

        // Act
        const computedDiff = textDiffer(before, after);

        // Assert
        expect(beforeFromDiff(computedDiff)).toEqual(before);
      })
    );
  });

  it('should be able to rebuild after given only the diff', () => {
    fc.assert(
      fc.property(diffArb, (diff) => {
        // Arrange
        const before = beforeFromDiff(diff);
        const after = afterFromDiff(diff);

        // Act
        const computedDiff = textDiffer(before, after);

        // Assert
        expect(afterFromDiff(computedDiff)).toEqual(after);
      })
    );
  });

  it('should compute the diff having the maximal number of unchanged lines', () => {
    fc.assert(
      fc.property(diffArb, (diff) => {
        // Arrange
        const before = beforeFromDiff(diff);
        const after = afterFromDiff(diff);

        // Act
        const computedDiff = textDiffer(before, after);

        // Assert
        expect(countUnchangedLines(computedDiff)).toBeGreaterThanOrEqual(countUnchangedLines(diff));
      })
    );
  });
});

// Helpers

function countUnchangedLines(diff: DiffLine[]): number {
  return diff.filter((d) => d.type === 'unchanged').length;
}
function beforeFromDiff(diff: DiffLine[]): string[] {
  return diff.filter((d) => d.type !== 'addition').map((d) => d.content);
}
function afterFromDiff(diff: DiffLine[]): string[] {
  return diff.filter((d) => d.type !== 'deletion').map((d) => d.content);
}
