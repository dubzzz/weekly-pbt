import fc from 'fast-check';
import 'jest-extended';
import { reorderTabs } from './014-reorderTabs';

const tabsWithSelectionArb = fc
  .set(fc.nat(), { minLength: 2 })
  .chain((tabs) =>
    fc.record({
      tabs: fc.constant(tabs),
      selectedTabs: fc.subarray(tabs, { minLength: 1, maxLength: tabs.length - 1 }),
    })
  )
  .chain(({ tabs, selectedTabs }) =>
    fc.record({
      tabs: fc.constant(tabs),
      selectedTabs: fc.constant(selectedTabs),
      movePosition: fc.constantFrom(...tabs.filter((t) => !selectedTabs.includes(t))),
    })
  );

describe('014-reorderTabs', () => {
  it('should group selected tabs together', () => {
    fc.assert(
      fc.property(tabsWithSelectionArb, ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        const startMovedSelection = newTabs.indexOf(selectedTabs[0]);
        expect(newTabs.slice(startMovedSelection, startMovedSelection + selectedTabs.length)).toEqual(selectedTabs);
      })
    );
  });

  it('should insert all the selected tabs before the move position', () => {
    fc.assert(
      fc.property(tabsWithSelectionArb, ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        const movePositionIndex = newTabs.indexOf(movePosition);
        for (const selected of selectedTabs) {
          const selectedIndex = newTabs.indexOf(selected);
          expect(selectedIndex).toBeLessThan(movePositionIndex);
        }
      })
    );
  });

  it('should not alter non-selected tabs', () => {
    fc.assert(
      fc.property(tabsWithSelectionArb, ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        expect(newTabs.filter((t) => !selectedTabs.includes(t))).toEqual(tabs.filter((t) => !selectedTabs.includes(t)));
      })
    );
  });

  it('should not change the list of tabs, just its order', () => {
    fc.assert(
      fc.property(tabsWithSelectionArb, ({ tabs, selectedTabs, movePosition }) => {
        // Arrange / Act
        const newTabs = reorderTabs(tabs, selectedTabs, movePosition);

        // Assert
        expect([...newTabs].sort()).toEqual([...tabs].sort());
      })
    );
  });
});
