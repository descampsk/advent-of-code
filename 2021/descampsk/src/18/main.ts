/* eslint-disable @typescript-eslint/no-explicit-any */
import { readInputs } from "../helpers/read-inputs";
import { add, computeMagnitude, reduction } from "./helpers";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  const pairs: any[] = [];
  lines.forEach((line) => pairs.push(JSON.parse(line)));
  return pairs;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const pairs = await decodeInput(inputPath);
  let result = pairs[0];
  pairs.shift();
  while (pairs.length) {
    result = add(result, pairs[0]);
    pairs.shift();
  }
  return computeMagnitude(result);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const pairs = await decodeInput(inputPath);

  let largestMagnitude = 0;
  let bestCombination = [0, 0];
  for (let i = 0; i < pairs.length; i++) {
    for (let j = 0; j < pairs.length; j++) {
      if (i !== j) {
        const firstResult = add(pairs[i], pairs[j]);
        const firstMagnitude = computeMagnitude(firstResult);
        if (firstMagnitude > largestMagnitude) {
          largestMagnitude = firstMagnitude;
          bestCombination = [i, j];
        }

        const secondResult = add(pairs[j], pairs[i]);
        const secondMagnitude = computeMagnitude(secondResult);
        if (secondMagnitude > largestMagnitude) {
          largestMagnitude = secondMagnitude;
          bestCombination = [j, i];
        }
      }
    }
  }
  console.log(bestCombination);
  return largestMagnitude;
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
