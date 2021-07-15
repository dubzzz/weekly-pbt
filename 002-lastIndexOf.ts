export function lastIndexOf(pattern: string, text: string): number {
  // Inspired from Rabin-Karp but relying on a unique footprint*
  // *two distinct words cannot have the same
  if (pattern.length === 0) {
    return 0;
  }
  let requestedFootprint = 0n;
  for (let index = pattern.length - 1; index >= 0; --index) {
    requestedFootprint = requestedFootprint * 65536n + BigInt(pattern.charCodeAt(index));
  }
  let movingFootprint = 0n;
  const startIndex = text.length - pattern.length;
  const modSize = 65536n ** BigInt(pattern.length);
  for (let index = text.length - 1; index >= 0; --index) {
    movingFootprint = (movingFootprint * 65536n + BigInt(text.charCodeAt(index))) % modSize;
    if (index <= startIndex && movingFootprint === requestedFootprint) {
      return index;
    }
  }
  return -1;
}
