import { resolveSecondPuzzleWithBruteForce } from "./brute";
import { checkUniqueCombination, decodeInput } from "./common";
import { resolveSecondPuzzleSmart } from "./smart";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const resolveFirstPuzzle = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  let appearance = 0;
  decodedInputs.forEach(({ outputs }) => {
    outputs.forEach((segment) => {
      const uniqueCombination = checkUniqueCombination(segment);
      if (uniqueCombination) {
        appearance += 1;
      }
    });
  });
  return appearance;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  const resultSecondPuzzleTest = await resolveSecondPuzzleWithBruteForce(
    TEST_INPUT_PATH
  );
  console.log(
    "The result of the second puzzle test is:",
    resultSecondPuzzleTest
  );

  console.time("brute-force");
  const resultSecondPuzzle = await resolveSecondPuzzleWithBruteForce(
    INPUT_PATH
  );
  console.log(
    "The result with brute force of the second puzzle is: ",
    resultSecondPuzzle
  );
  console.timeEnd("brute-force");

  console.time("smart");
  const resultSmartSecondPuzzle = await resolveSecondPuzzleSmart(INPUT_PATH);
  console.log(
    "The result with smart of the second puzzle is: ",
    resultSmartSecondPuzzle
  );
  console.timeEnd("smart");
};

main().catch((error) => {
  console.error(error);
});
