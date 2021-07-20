export type DiffLine = {
  type: 'addition' | 'deletion' | 'kept';
  content: string;
};

/**
 * Compute the diff between two set of lines
 *
 * @param before - Lines before
 * @param after - Lines after
 *
 * @returns
 * The minimal diff, ie. the diff preserving as many lines as possible.
 */
export function textDiffer(before: string[], after: string[]): DiffLine[] {
  const sharedLines = longestCommonSubarray(before, after, 0, 0, []);

  const diff: DiffLine[] = [];
  let indexBefore = 0;
  let indexAfter = 0;
  for (const sharedLine of sharedLines) {
    for (; before[indexBefore] !== sharedLine; ++indexBefore) {
      diff.push({ type: 'deletion', content: before[indexBefore] });
    }
    for (; after[indexAfter] !== sharedLine; ++indexAfter) {
      diff.push({ type: 'addition', content: after[indexAfter] });
    }
    ++indexBefore;
    ++indexAfter;
    diff.push({ type: 'kept', content: sharedLine });
  }
  for (; indexBefore !== before.length; ++indexBefore) {
    diff.push({ type: 'deletion', content: before[indexBefore] });
  }
  for (; indexAfter !== after.length; ++indexAfter) {
    diff.push({ type: 'addition', content: after[indexAfter] });
  }
  return diff;
}

function longestCommonSubarray(
  dataA: string[],
  dataB: string[],
  startA: number,
  startB: number,
  sharedCache: string[][][]
): string[] {
  if (dataA.length <= startA || dataB.length <= startB) {
    return [];
  }
  if (startA in sharedCache) {
    if (startB in sharedCache[startA]) {
      return sharedCache[startA][startB];
    }
  } else {
    sharedCache[startA] = [];
  }

  const optionSkippingStartA = longestCommonSubarray(dataA, dataB, startA + 1, startB, sharedCache);
  const indexStartAInB = dataB.indexOf(dataA[startA], startB);
  if (indexStartAInB === -1) {
    sharedCache[startA][startB] = optionSkippingStartA;
    return optionSkippingStartA;
  }
  const optionIncludingStartA = [
    dataA[startA],
    ...longestCommonSubarray(dataA, dataB, startA + 1, indexStartAInB + 1, sharedCache),
  ];
  const bestOption =
    optionSkippingStartA.length < optionIncludingStartA.length ? optionIncludingStartA : optionSkippingStartA;
  sharedCache[startA][startB] = bestOption;
  return bestOption;
}
