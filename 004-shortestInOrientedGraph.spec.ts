import fc from 'fast-check';
import { shortestInOrientedGraph } from './004-shortestInOrientedGraph';

// Generate oriented graphs with a known path going from knownPath[0] to knownPath[knownPath.length -1]
// by taking one by one the edges defined into knownPathEdges (a subset of the edges of the graph itself).
const orientedGraphArbitrary = fc
  .record({
    // edges that will compose the known path (starting at node=0)
    knownPathExcludingStart: fc.set(fc.record({ node: fc.integer({ min: 1 }), length: fc.nat() }), {
      compare: (na, nb) => na.node === nb.node,
    }),
    // some more edges that will compose our graph
    extraEdges: fc.array(fc.record({ from: fc.nat(), to: fc.nat(), length: fc.nat() })),
    // some more nodes that will compose our graph
    extraNodes: fc.array(fc.nat()),
  })
  .chain(({ knownPathExcludingStart, extraEdges, extraNodes }) => {
    const startNode = 0;
    const knownPath = [startNode, ...knownPathExcludingStart.map((n) => n.node)];
    const knownPathEdges = knownPathExcludingStart.map((n, index) => ({
      from: index !== 0 ? knownPathExcludingStart[index - 1].node : startNode,
      to: n.node,
      length: n.length,
    }));
    const allEdges = [...knownPathEdges, ...extraEdges];
    const allNodes = [startNode, ...new Set(allEdges.flatMap((e) => [e.from, e.to])), ...extraNodes];
    return fc.record({
      knownPath: fc.constant(knownPath),
      knownPathEdges: fc.constant(knownPathEdges),
      edges: fc.shuffledSubarray(allEdges, { minLength: allEdges.length }),
      nodes: fc.shuffledSubarray(allNodes, { minLength: allNodes.length }),
    });
  });

// Generate a graph not having any path going from startNode to endNode (by construct)
const orientedGraphNoWayArbitrary = fc
  .record({
    // We consider start = 0 and end = 19.
    // We delimit two zones:
    // - start zone contains nodes 0 to 9 (included)
    // - end zone contains nodes 10 to 19 (included)
    edgesStartZone: fc.array(
      fc.record({ from: fc.integer({ min: 0, max: 9 }), to: fc.integer({ min: 0, max: 9 }), length: fc.nat() })
    ),
    edgesEndZone: fc.array(
      fc.record({ from: fc.integer({ min: 10, max: 19 }), to: fc.integer({ min: 10, max: 19 }), length: fc.nat() })
    ),
    edgesEndToStart: fc.array(
      fc.record({ from: fc.integer({ min: 10, max: 19 }), to: fc.integer({ min: 0, max: 9 }), length: fc.nat() })
    ),
  })
  .map((config) => ({
    startNode: 0,
    endNode: 19,
    nodes: [...Array(20)].map((_, i) => i),
    edges: [...config.edgesStartZone, ...config.edgesEndZone, ...config.edgesEndToStart],
  }));

describe('004-shortestInOrientedGraph', () => {
  it('should build a path starting by the requested startNode whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges, nodes }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        if (startNode === endNode) expect(shortestPath).toEqual([]);
        else expect(shortestPath[0].from).toBe(startNode);
      })
    );
  });

  it('should build a path ending by the requested endNode whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges, nodes }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        if (startNode === endNode) expect(shortestPath).toEqual([]);
        else expect(shortestPath[shortestPath.length - 1].to).toBe(endNode);
      })
    );
  });

  it('should build an ordered path of edges whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges, nodes }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        for (let index = 1; index < shortestPath.length; ++index) {
          expect(shortestPath[index].from).toBe(shortestPath[index - 1].to);
        }
      })
    );
  });

  it('should build a path of edges being a subset of the edges of the graph whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges, nodes }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        for (const edge of shortestPath) {
          expect(shortestPath).toContainEqual(edge);
        }
      })
    );
  });

  it('should be able to find a path shorther or equal to the one we come up with', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, knownPathEdges, edges, nodes }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        const distanceKnownPath = knownPathEdges.reduce((acc, e) => acc + e.length, 0);
        const distanceShortestPath = shortestPath.reduce((acc, e) => acc + e.length, 0);
        expect(distanceShortestPath).toBeLessThanOrEqual(distanceKnownPath);
      })
    );
  });

  it('should not return any path whenever there is no way going from start to end', () => {
    fc.assert(
      fc.property(orientedGraphNoWayArbitrary, ({ startNode, endNode, nodes, edges }) => {
        // Arrange / Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, nodes, edges);

        // Assert
        expect(shortestPath).toBe(undefined);
      })
    );
  });
});
