import fc from 'fast-check';
import { LinkedList, detectCycleInLinkedList } from './012-detectCycleInLinkedList';

describe('012-detectCycleInLinkedList', () => {
  it('should not detect any cycle in a non-looping linked list', () => {
    fc.assert(
      fc.property(
        fc.letrec((tie) => ({
          node: fc.record({
            value: fc.integer(),
            next: fc.option(tie('node') as fc.Arbitrary<LinkedList>, { nil: undefined, depthFactor: 1 }),
          }),
        })).node,
        (linkedList) => {
          // Arrange / Act
          const cycleDetected = detectCycleInLinkedList(linkedList);

          // Assert
          expect(cycleDetected).toBe(false);
        }
      )
    );
  });

  it('should detect a cycle in a looping linked list', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (nodes) => {
        // Arrange
        const lastNode: LinkedList = { value: nodes[0], next: undefined };
        const linkedList = nodes.slice(1).reduce((acc, n) => ({ value: n, next: acc }), lastNode);
        lastNode.next = linkedList;

        // Act
        const cycleDetected = detectCycleInLinkedList(linkedList);

        // Assert
        expect(cycleDetected).toBe(true);
      })
    );
  });
});
