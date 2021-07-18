type Edge = { from: number; to: number; length: number };

function findRemainingNodeWithMinimalDistance(
  distanceToNode: Map<number, { distance: number; edges: Edge[] }>
): number | undefined {
  let minNode: number | undefined = undefined;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const [node, { distance }] of distanceToNode) {
    if (distance < minDistance) {
      minNode = node;
      minDistance = distance;
    }
  }
  return minNode;
}

export function shortestInOrientedGraph(startNode: number, endNode: number, edges: Edge[]): Edge[] | undefined {
  const distanceToNode = new Map(
    edges.flatMap((e) => [e.from, e.to]).map((node) => [node, { distance: Number.POSITIVE_INFINITY, edges: [] }])
  );
  if (distanceToNode.has(startNode)) {
    distanceToNode.set(startNode, { distance: 0, edges: [] });
  }
  while (true) {
    const nextNode = findRemainingNodeWithMinimalDistance(distanceToNode);
    if (nextNode === undefined) {
      return undefined; // no path found
    }
    const data = distanceToNode.get(nextNode)!;
    if (nextNode === endNode) {
      return data.edges;
    }
    distanceToNode.delete(nextNode);
    for (const e of edges) {
      if (
        e.from === nextNode &&
        distanceToNode.has(e.to) &&
        distanceToNode.get(e.to)!.distance > data.distance + e.length
      ) {
        distanceToNode.set(e.to, { distance: data.distance + e.length, edges: [...data.edges, e] });
      }
    }
  }
}
