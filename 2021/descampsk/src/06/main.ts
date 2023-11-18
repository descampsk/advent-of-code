import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const reproducesFishes = (
  initialFishes: number[],
  period: number,
  firstPeriod: number,
  days: number
) => {
  const fishes = [...initialFishes];
  for (let i = 0; i < days; i += 1) {
    const initialLength = fishes.length;
    for (let j = 0; j < initialLength; j += 1) {
      if (fishes[j] === 0) {
        fishes[j] = period - 1;
        fishes.push(firstPeriod - 1);
      } else {
        fishes[j] -= 1;
      }
    }
  }
  return fishes;
};

const reproducesFishesOptimized = (
  initialFishes: number[],
  period: number,
  firstPeriod: number,
  days: number
) => {
  let fishesPerDay: Record<number, number> = {};
  for (let i = 0; i < firstPeriod; i += 1) {
    fishesPerDay[i] = 0;
  }
  initialFishes.forEach((fish) => {
    fishesPerDay[fish] += 1;
  });
  for (let i = 0; i < days; i += 1) {
    const newFishesPerDay: Record<number, number> = {};
    for (let j = 0; j < firstPeriod; j += 1) {
      newFishesPerDay[j] = 0;
    }
    for (let j = 0; j < firstPeriod; j += 1) {
      if (j === 0) {
        newFishesPerDay[firstPeriod - 1] += fishesPerDay[j];
        newFishesPerDay[period - 1] += fishesPerDay[j];
      } else {
        newFishesPerDay[j - 1] += fishesPerDay[j];
      }
    }
    fishesPerDay = { ...newFishesPerDay };
  }
  return Object.values(fishesPerDay).reduce((a, b) => a + b);
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const initialFishes = lines[0]
    .split(",")
    .map((number) => parseInt(number, 10));
  const days = 80;
  const period = 7; // From 6 to 0, it's a period of 7 days
  const firstPeriod = 9; // From 8 to 0, it's a period of 9 days
  const fishes = reproducesFishes(initialFishes, period, firstPeriod, days);
  return fishes.length;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const initialFishes = lines[0]
    .split(",")
    .map((number) => parseInt(number, 10));
  const numberOfFishes = reproducesFishesOptimized(initialFishes, 7, 9, 256);
  return numberOfFishes;
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
