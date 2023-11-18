import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const priorities = Array.from(
  " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);

const getPriority = (letter: string): number =>
  priorities.findIndex((value) => value === letter);

const findDoubles = (first: string, second: string): string => {
  const doubles: string[] = [];
  Array.from(second).forEach((letter) => {
    if (first.includes(letter)) doubles.push(letter);
  });
  return doubles.join("");
};

const findDouble = (first: string, second: string): string =>
  findDoubles(first, second).at(0) || " ";

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const sum = lines.reduce((acc, line) => {
    const first = line.substring(0, line.length / 2);
    const second = line.substring(line.length / 2);
    const letter = findDouble(first, second);
    const priority = getPriority(letter);
    return acc + priority;
  }, 0);
  return sum;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  let sum = 0;
  for (let i = 0; i < lines.length; i += 3) {
    const letters1 = findDoubles(lines[i], lines[i + 1]);
    const letters2 = findDoubles(lines[i + 1], lines[i + 2]);
    const letter = findDouble(letters1, letters2);
    const priority = getPriority(letter);
    sum += priority;
  }
  return sum;
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
