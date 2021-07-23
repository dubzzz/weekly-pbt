import fc from 'fast-check';
import { RaceParticipants, racePodium } from './racePodium';

describe('racePodium', () => {
  it('should predict the right podium', () => {
    fc.assert(
      fc.property(tupleN(fc.nat(), 25), (speeds) => {
        // Arrange
        const compareParticipants = (pa: number, pb: number) => {
          if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
          else return pa - pb;
        };
        const runRace = (...participants: RaceParticipants): RaceParticipants => {
          return participants.sort(compareParticipants);
        };

        // Act
        const podium = racePodium(runRace);

        // Assert
        const rankedParticipants = [...Array(25)].map((_, i) => i).sort(compareParticipants);
        const expectedPodium = rankedParticipants.slice(0, 3);
        expect(podium).toEqual(expectedPodium);
      })
    );
  });

  it('should never do more than 7 races', () => {
    fc.assert(
      fc.property(tupleN(fc.nat(), 25), (speeds) => {
        // Arrange
        const compareParticipants = (pa: number, pb: number) => {
          if (speeds[pa] !== speeds[pb]) return speeds[pb] - speeds[pa];
          else return pa - pb;
        };
        const runRace = jest.fn((...participants: RaceParticipants): RaceParticipants => {
          return participants.sort(compareParticipants);
        });

        // Act
        racePodium(runRace);

        // Assert
        expect(runRace.mock.calls.length).toBeLessThanOrEqual(7);
      })
    );
  });
});

// Helpers

function tupleN<T>(arb: fc.Arbitrary<T>, n: number): fc.Arbitrary<T[]> {
  // In theory we may want to use something like:
  //   fc.array(arb, {minLength: n, maxLength: n})
  // as it results into a simpler code. Unfortunately, for the moment it does not shrink as well as tuples.
  return fc.tuple(...Array<fc.Arbitrary<T>>(n).fill(arb));
}
