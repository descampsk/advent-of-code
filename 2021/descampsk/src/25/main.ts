import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  return lines;
};

type Down = "v";
type Right = ">";
type Empty = ".";
type Case = Down | Right | Empty;
type FullCase = {
  char: Case;
  hasMoved: boolean;
};

const printMatrix = (matrix: Case[][]) => {
  for (let i = 0; i < matrix.length; i++) {
    console.log(matrix[i].map((value) => value).join(""));
  }
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  let matrix = decodedInputs.map((line) => {
    const lineWithObject: Case[] = [];
    for (let i = 0; i < line.length; i++) {
      lineWithObject.push(line.charAt(i) as Case);
    }
    return lineWithObject;
  });
  printMatrix(matrix);

  let isBlocked = false;
  let iteration = 0;
  while (!isBlocked) {
    iteration++;
    isBlocked = true;
    let newMatrix = matrix.map((line) => [...line]);
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const char = matrix[i][j];
        if (char === ">") {
          const nextCase = j === matrix[i].length - 1 ? 0 : j + 1;
          if (matrix[i][nextCase] === ".") {
            newMatrix[i][nextCase] = ">";
            newMatrix[i][j] = ".";
            isBlocked = false;
          }
        }
      }
    }
    matrix = newMatrix.map((line) => [...line]);
    newMatrix = matrix.map((line) => [...line]);
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const char = matrix[i][j];
        if (char === "v") {
          const nextCase = i === matrix.length - 1 ? 0 : i + 1;
          if (matrix[nextCase][j] === ".") {
            newMatrix[nextCase][j] = "v";
            newMatrix[i][j] = ".";
            isBlocked = false;
          }
        }
      }
    }

    console.log("iteration: ", iteration);
    matrix = newMatrix.map((line) => [...line]);
  }
  return iteration;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  return 0;
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
