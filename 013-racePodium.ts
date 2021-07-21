/**
 * Find the three fastest candidates among: [0, 1, 2, ..., 15].
 * In order to do so you are given a runRace function able to run a race with four participants.
 * You may consider that our candidates are really regular so they run with the exact same time and are never tired.
 *
 * @param runRace - Run a race with the received participants. Outputs the final ranking. In case of equality the participant with the smallest id wins.
 *
 * @returns
 * Ordered top three.
 */
export function racePodium(
  runRace: (...participants: [number, number, number, number]) => [number, number, number, number]
): [number, number, number] {
  const raceResults: [number, number, number, number][] = [];

  // We start with one run per candidate first
  //   c0  c1  c2  c3  <-- race #1
  //   c4  c5  c6  c7  <-- race #2
  //   c8  c9 c10 c11  <-- race #3
  //  c12 c13 c14 c15  <-- race #4
  for (let index = 0; index !== 4; ++index) {
    const ca = index * 4;
    const cb = index * 4 + 1;
    const cc = index * 4 + 2;
    const cd = index * 4 + 3;
    raceResults.push(runRace(ca, cb, cc, cd));
  }

  // Run a race against all the winners
  raceResults.push(runRace(raceResults[0][0], raceResults[1][0], raceResults[2][0], raceResults[3][0]));
  // But the second may never won a race and be second in the first race too (if winner was in the same race)
  // So potential seconds are: all firsts on first races (except winner) + second of the race with winner
  // But from race#5, we also know that the last of this last race will not be on podium.
  // And we also learnt that the candidate that ranked second against the third of last race will not be on podium too.
  const firstOfWinnerRace = raceResults[4][0];
  const firstRaceOfFirstWinnerRace = Math.floor(firstOfWinnerRace / 4);
  // The second is one of:
  // - raceResults[firstRaceOfFirstWinnerRace][1] as it was second when it raced against winner
  // - raceResults[4][1] as it was second when running against winner
  // The third is one of:
  // - raceResults[firstRaceOfFirstWinnerRace][1]
  // - raceResults[firstRaceOfFirstWinnerRace][2]
  // - raceResults[4][1] (second of winner race)
  // - raceResults[index of first race for raceResults[4][1]][1]
  // - raceResults[4][2] (third of winner race)
  raceResults.push(
    runRace(
      raceResults[4][1],
      raceResults[4][2],
      raceResults[firstRaceOfFirstWinnerRace][1],
      raceResults[firstRaceOfFirstWinnerRace][2]
    )
  );
  const podiumSecond = raceResults[5][0];
  if (podiumSecond === raceResults[firstRaceOfFirstWinnerRace][1]) {
    // The third is the second of the last race
    return [firstOfWinnerRace, podiumSecond, raceResults[5][1]];
  }
  // If second of winner race, we need the run another race as we don't know
  // what would be the ranking for raceResults[firstRaceOfSecondWinnerRace][1].
  // The two others participants of previous race cannot be first, not eligible for second rank.
  const secondOfWinnerRace = raceResults[4][1];
  const firstRaceOfSecondWinnerRace = Math.floor(secondOfWinnerRace / 4);
  raceResults.push(
    runRace(raceResults[5][1], raceResults[5][2], raceResults[5][3], raceResults[firstRaceOfSecondWinnerRace][1])
  );

  return [firstOfWinnerRace, podiumSecond, raceResults[6][0]];
}
