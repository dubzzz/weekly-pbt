/**
 * Re-order of multiple tabs at the same time and relatively to others (as browsers do).
 *
 * @param tabs - The original set of tabs of the browser
 * @param selectedTabs - The tab currently being moved, a subarray of tabs
 * @param moveBeforeTab - One of the tabs oftabs but not of selectedTabs taken as a reference for the dropping place
 *
 * @returns
 * New tabs configuration after the drop.
 */
export function reorderTabs(tabs: number[], selectedTabs: number[], moveBeforeTab: number): number[] {
  const unmovedTabs = tabs.filter((t) => !selectedTabs.includes(t));
  const indexInUnmoved = unmovedTabs.indexOf(moveBeforeTab);
  return [...unmovedTabs.slice(0, indexInUnmoved), ...selectedTabs, ...unmovedTabs.slice(indexInUnmoved)];
}
