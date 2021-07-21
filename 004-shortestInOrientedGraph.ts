export type Edge = { from: number; to: number; length: number };

/**
 * Find the shortest path in an oriented graph to go from a start node to the end node
 *
 * Applications in real life:
 * - Optimal metro path to go from station A to station B
 *
 * @param startNode - Id of the start node (must be an integer value)
 * @param endNode - Id of the end node (must be an integer value)
 * @param nodes - List containing all the known nodes eligible for the graph (nodes outside this list will be ignored even if edges leading to them exist)
 * @param edges - List of all the connections between nodes of this graph
 *
 * @returns
 * The list of edges to take to go from start to end and resulting into the shortest path (if there is one).
 * If there is no path going to the end, then it returns undefined.
 */
export function shortestInOrientedGraph(
  startNode: number,
  endNode: number,
  nodes: number[],
  edges: Edge[]
): Edge[] | undefined {
  const distanceToNode = new Map(nodes.map((node) => [node, { distance: Number.POSITIVE_INFINITY, edges: [] }]));
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
