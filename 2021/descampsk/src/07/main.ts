import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const positions = lines[0].split(",").map((number) => parseInt(number, 10));
  return positions;
};

const computeArithmeticSum = (
  n: number,
  firstTerme: number,
  reason: number
) => {
  const sum = (n + 1) * (firstTerme + (reason * n) / 2);
  return sum;
};

const computeMinFuel = (positions: number[], increaseFuel: number) => {
  const maxPosition = Math.max(...positions);
  let minSumFuel =
    maxPosition * computeArithmeticSum(maxPosition, 1, increaseFuel);
  for (let i = 0; i <= maxPosition; i += 1) {
    let sumFuel = 0;
    let isCheaper = true;
    for (let j = 0; j < positions.length; j += 1) {
      const difference = Math.abs(positions[j] - i);
      if (difference) {
        sumFuel += computeArithmeticSum(difference - 1, 1, increaseFuel);
      }
      if (sumFuel > minSumFuel) {
        isCheaper = false;
        break;
      }
    }

    if (isCheaper) {
      minSumFuel = sumFuel;
    }
  }
  return minSumFuel;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const positions = await decodeInput(inputPath);
  return computeMinFuel(positions, 0);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const positions = await decodeInput(inputPath);
  return computeMinFuel(positions, 1);
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
