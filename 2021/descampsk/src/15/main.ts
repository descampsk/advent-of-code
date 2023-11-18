import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string): Promise<number[][]> => {
  const lines = await readInputs(inputPath);
  lines.pop();
  return lines.map((line) => [...line].map((number) => parseInt(number, 10)));
};

const buildFullMap = (matrix: number[][]) => {
  const fullMatrix: number[][] = JSON.parse(JSON.stringify(matrix));
  const lengthI = matrix.length;
  const lengthJ = matrix[0].length;

  for (let i = 0; i < matrix.length * 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (j === 0 && i >= lengthI) {
        const newLine = fullMatrix[i - lengthI]
          .slice(0, lengthI)
          .map((number) => {
            if (number === 9) {
              return 1;
            }
            return number + 1;
          });
        fullMatrix.push(newLine);
      } else if (j > 0) {
        const newLine = fullMatrix[i]
          .slice((j - 1) * lengthJ, j * lengthJ)
          .map((number) => {
            if (number === 9) {
              return 1;
            }
            return number + 1;
          });
        fullMatrix[i].push(...newLine);
      }
    }
  }
  return fullMatrix;
};

const dijtstraAlgorithm = (matrix: number[][]) => {
  const updatedMatrix: number[][] = new Array(matrix.length)
    .fill(0)
    .map(() => new Array(matrix[0].length).fill(0));
  const visited = JSON.parse(JSON.stringify(updatedMatrix));
  const nextCases: number[][] = [];
  let currentCase = [0, 0];
  while (
    currentCase &&
    currentCase[0] !== matrix.length &&
    currentCase[1] !== matrix[0].length
  ) {
    const x = currentCase[0];
    const y = currentCase[1];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const xToUpdate = x + i;
        const yToUpdate = y + j;
        if (
          (i !== 0 || j !== 0) &&
          (xToUpdate !== 0 || yToUpdate !== 0) &&
          Math.abs(i) !== Math.abs(j) &&
          xToUpdate >= 0 &&
          xToUpdate < matrix.length &&
          yToUpdate >= 0 &&
          yToUpdate < matrix[0].length &&
          !visited[x + i][yToUpdate]
        ) {
          const newValue = matrix[xToUpdate][yToUpdate] + updatedMatrix[x][y];
          updatedMatrix[xToUpdate][yToUpdate] = newValue;
          nextCases.push([xToUpdate, yToUpdate, newValue]);
          visited[xToUpdate][yToUpdate] = 1;
        }
      }
    }
    nextCases.sort((a, b) => a[2] - b[2]);
    [currentCase] = nextCases;
    nextCases.shift();
  }
  return updatedMatrix;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const matrix = await decodeInput(inputPath);
  const updatedMatrix = dijtstraAlgorithm(matrix);
  return updatedMatrix[updatedMatrix.length - 1][updatedMatrix[0].length - 1];
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const matrix = await decodeInput(inputPath);
  const fullMatrix = buildFullMap(matrix);
  const updatedMatrix = dijtstraAlgorithm(fullMatrix);
  return updatedMatrix[updatedMatrix.length - 1][updatedMatrix[0].length - 1];
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
