/**
 * Compute the distance of Levenshtein between two strings
 *
 * @param stringA - The first string to be taken into account
 * @param stringB - The second string to be taken into account
 *
 * @returns
 * The Levenshtein distance is a string metric for measuring the difference between two sequences.
 * The Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.
 */
export function levenshteinDistance(stringA: string, stringB: string): number {
  return levenshteinDistanceInternal(stringA, stringB, 0, 0, []);
}

function levenshteinDistanceInternal(
  stringA: string,
  stringB: string,
  indexA: number,
  indexB: number,
  cache: number[][]
): number {
  if (stringA.length <= indexA) {
    return stringB.length - indexB;
  }
  if (stringB.length <= indexB) {
    return stringA.length - indexA;
  }
  if (indexA in cache) {
    if (indexB in cache[indexA]) {
      return cache[indexA][indexB];
    }
  } else {
    cache[indexA] = [];
  }

  const minimalCost = Math.min(
    stringA[indexA] === stringB[indexB]
      ? // Option #1: We keep it in both as it is the same in both strings
        levenshteinDistanceInternal(stringA, stringB, indexA + 1, indexB + 1, cache)
      : // Option #1': We substitute stringB[indexB] by stringA[indexA]
        1 + levenshteinDistanceInternal(stringA, stringB, indexA + 1, indexB + 1, cache),
    // Option #2: We insert stringB[indexB] at indexA in stringA
    // Option #2': We delete the character at indexB in stringB
    1 + levenshteinDistanceInternal(stringA, stringB, indexA, indexB + 1, cache),
    // Option #3: We insert stringA[indexA] at indexB in stringB
    // Option #3': We delete the character at indexA in stringA
    1 + levenshteinDistanceInternal(stringA, stringB, indexA + 1, indexB, cache)
  );

  cache[indexA][indexB] = minimalCost;
  return minimalCost;
}
