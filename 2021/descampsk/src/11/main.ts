import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  const matrix: number[][] = [];
  lines.forEach((line) => {
    matrix.push([...line].map((number) => parseInt(number, 10)));
  });
  return matrix;
};

const triggerFlash = (i: number, j: number, matrix: number[][]) => {
  let totalFlash = 1;
  for (let k = -1; k < 2; k++) {
    for (let l = -1; l < 2; l++) {
      if (
        (k || l) &&
        i + k >= 0 &&
        i + k < matrix.length &&
        j + l >= 0 &&
        j + l < matrix[i + k].length
      ) {
        // eslint-disable-next-line no-param-reassign
        matrix[i + k][j + l]++;

        if (matrix[i + k][j + l] === 10) {
          totalFlash += triggerFlash(i + k, j + l, matrix);
        }
      }
    }
  }
  return totalFlash;
};

const isAllNull = (matrix: number[][]) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        return false;
      }
    }
  }
  return true;
};

const resolvePuzzle = async (inputPath: string, maxStep: number) => {
  const matrix = await decodeInput(inputPath);
  let totalFlash = 0;
  for (let step = 0; step < maxStep; step++) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] += 1;
        if (matrix[i][j] === 10) {
          matrix[i][j] = 20;
          totalFlash += triggerFlash(i, j, matrix);
        }
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] > 9) {
          matrix[i][j] = 0;
        }
      }
    }
    if (isAllNull(matrix)) {
      console.log("All octopuses flash at", step + 1);
    }
  }
  return totalFlash;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolvePuzzle(TEST_INPUT_PATH, 100);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolvePuzzle(INPUT_PATH, 100);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  const resultSecondPuzzleTest = await resolvePuzzle(TEST_INPUT_PATH, 200);
  console.log(
    "The result of the second puzzle test is:",
    resultSecondPuzzleTest
  );
  const resultSecondPuzzle = await resolvePuzzle(INPUT_PATH, 350);
  console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
