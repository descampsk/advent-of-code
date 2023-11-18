import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const startPositions: number[] = [];
  startPositions.push(parseInt(lines[0].charAt(lines[0].length - 1), 10));
  startPositions.push(parseInt(lines[1].charAt(lines[1].length - 1), 10));
  return startPositions;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const startPositions = await decodeInput(inputPath);
  const positions = [...startPositions];
  const scores = [0, 0];
  let dice = 0;
  let rolls = 0;

  while (scores[0] < 1000 && scores[1] < 1000) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        dice += 1;
        if (dice === 101) {
          dice = 1;
        }
        rolls += 1;
        positions[i] += dice;
        positions[i] %= 10;
        if (positions[i] === 0) {
          positions[i] = 10;
        }
      }
      scores[i] += positions[i];
      // console.log(
      //   `Joueur ${i} a ${scores[i]} points à la position ${positions[i]} après le roll ${rolls}. Le dé est à ${dice}`
      // );
      if (scores[0] >= 1000 || scores[1] >= 1000) {
        console.log("scores", scores);
        console.log("rolls", rolls);
        return scores[Math.abs(i - 1)] * rolls;
      }
    }
  }
  return scores;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const startPositions = await decodeInput(inputPath);
  const positions = [...startPositions];
  const scores = [0, 0];
  let dice = 0;
  let rolls = 0;
  return 0;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  // const resultSecondPuzzleTest = await resolveSecondPuzzle(TEST_INPUT_PATH);
  // console.log(
  //   "The result of the second puzzle test is:",
  //   resultSecondPuzzleTest
  // );
  // const resultSecondPuzzle = await resolveSecondPuzzle(INPUT_PATH);
  // console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
