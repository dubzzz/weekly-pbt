import fc from 'fast-check';
import { racePodium } from './013-racePodium';

describe('013-racePodium', () => {
  it('should predict the right podium', () => {
    fc.assert(
      fc.property(tupleN(fc.nat(), 16), (speeds) => {
        // Arrange
        const compareParticipants = (pa: number, pb: number) => {
          if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
          else return pa - pb;
        };
        const runRace = (...participants: [number, number, number, number]): [number, number, number, number] => {
          return participants.sort(compareParticipants);
        };

        // Act
        const podium = racePodium(runRace);

        // Assert
        const rankedParticipants = [...Array(16)].map((_, i) => i).sort(compareParticipants);
        const expectedPodium = rankedParticipants.slice(0, 3);
        expect(podium).toEqual(expectedPodium);
      })
    );
  });
});

// Helpers

function tupleN<T>(arb: fc.Arbitrary<T>, n: number): fc.Arbitrary<T[]> {
  // In theory we may want to use something like:
  //   fc.array(arb, {minLength: 16, maxLength: 16})
  // as it results into a simpler code. Unfortunately, for the moment it does not shrink as well as tuples.
  return fc.tuple(...Array<fc.Arbitrary<T>>(n).fill(arb));
}
