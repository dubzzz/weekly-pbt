import fc from 'fast-check';
import { shortestInOrientedGraph } from './004-shortestInOrientedGraph';

const orientedGraphArbitrary = fc
  .record({
    knownPathExcludingStart: fc.set(fc.record({ node: fc.integer({ min: 1 }), length: fc.nat() }), {
      compare: (na, nb) => na.node === nb.node,
    }),
    extraEdges: fc.array(fc.record({ from: fc.nat(), to: fc.nat(), length: fc.nat() })),
  })
  .chain(({ knownPathExcludingStart, extraEdges }) => {
    const startNode = 0;
    const knownPath = [startNode, ...knownPathExcludingStart.map((n) => n.node)];
    const knownPathEdges = knownPathExcludingStart.map((n, index) => ({
      from: index !== 0 ? knownPathExcludingStart[index - 1].node : -1,
      to: n.node,
      length: n.length,
    }));
    const allEdges = [...knownPathEdges, ...extraEdges];
    return fc.record({
      knownPath: fc.constant(knownPath),
      knownPathEdges: fc.constant(knownPathEdges),
      edges: fc.shuffledSubarray(allEdges, { minLength: allEdges.length }),
    });
  });

describe('004-shortestInOrientedGraph', () => {
  it('should build a path starting by the requested startNode whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, edges);

        // Assert
        expect(shortestPath[0].from).toBe(startNode);
      })
    );
  });

  it('should build a path ending by the requested endNode whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, edges);

        // Assert
        expect(shortestPath[shortestPath.length - 1].to).toBe(endNode);
      })
    );
  });

  it('should build an ordered path of edges whenever a path from start to end exists', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, edges }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, edges);

        // Assert
        for (let index = 1; index < shortestPath.length; ++index) {
          expect(shortestPath[index].from).toBe(shortestPath[index - 1].to);
        }
        expect(edges).toIncludeAnyMembers(shortestPath);
      })
    );
  });

  it('should be able to find a path shorther or equal to the one we come up with', () => {
    fc.assert(
      fc.property(orientedGraphArbitrary, ({ knownPath, knownPathEdges, edges }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, edges);

        // Assert
        const distanceKnownPath = knownPathEdges.reduce((acc, e) => acc + e.length, 0);
        const distanceShortestPath = shortestPath.reduce((acc, e) => acc + e.length, 0);
        expect(distanceShortestPath).toBeLessThanOrEqual(distanceKnownPath);
      })
    );
  });

  /*it('should not return any path whenever there is no way going from start to end', () => {
    fc.assert(
      fc.property(orientedGraphNoWayArbitrary, ({ knownPath, knownPathEdges, edges }) => {
        // Arrange
        const startNode = knownPath[0];
        const endNode = knownPath[knownPath.length - 1];

        // Act
        const shortestPath = shortestInOrientedGraph(startNode, endNode, edges);

        // Assert
        const distanceKnownPath = knownPathEdges.reduce((acc, e) => acc + e.length, 0);
        const distanceShortestPath = shortestPath.reduce((acc, e) => acc + e.length, 0);
        expect(distanceShortestPath).toBeLessThanOrEqual(distanceKnownPath);
      })
    );
  });*/
});
