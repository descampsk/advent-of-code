import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const getElvesLoad = (inputs: string[]): number[] => {
  return inputs.reduce(
    (acc: number[], line) => {
      if (line) {
        acc[acc.length - 1] += Number(line);
      } else {
        acc.push(0);
      }
      return acc;
    },
    [0]
  );
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const elves = getElvesLoad(lines);
  return Math.max(...elves);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const elves = getElvesLoad(lines).sort((prev, next) => next - prev);
  return elves[0] + elves[1] + elves[2];
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  const resultSecondPuzzleTest = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log(
    "The result of the second puzzle test is:",
    resultSecondPuzzleTest
  );
  const resultSecondPuzzle = await resolveSecondPuzzle(INPUT_PATH);
  console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
