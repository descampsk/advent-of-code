import { readInputs } from "../helpers/read-inputs";
import { decodeHexa } from "./helpers";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  return lines[0];
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const hexa = await decodeInput(inputPath);
  const { versions, types, numbers } = decodeHexa(hexa);
  console.log(types);
  console.log(numbers);
  let sum = 0;
  versions.forEach((version) => {
    sum += version;
  });
  return sum;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const hexa = await decodeInput(inputPath);
  const { value } = decodeHexa(hexa);
  return value;
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
