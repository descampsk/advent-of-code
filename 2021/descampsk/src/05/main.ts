import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

type Cloud = {
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
};

const decodeInputs = (lines: string[]) => {
  const clouds: Cloud[] = [];
  lines.forEach((line) => {
    const fromAndTo = line.split(" -> ");
    if (fromAndTo && fromAndTo.length > 1) {
      const [xTo, yTo] = fromAndTo[0].split(",");
      const [xFrom, yFrom] = fromAndTo[1].split(",");
      clouds.push({
        from: {
          x: parseInt(xFrom, 10),
          y: parseInt(yFrom, 10),
        },
        to: {
          x: parseInt(xTo, 10),
          y: parseInt(yTo, 10),
        },
      });
    }
  });
  return clouds;
};

const printMatrix = (matrix: number[][]) => {
  let matrixString = "";
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      matrixString = `${matrixString}${matrix[i][j]}`;
    }
    matrixString = `${matrixString}\n`;
  }
  console.log(matrixString);
};

const scoreMatrix = (matrix: number[][]) => {
  let score = 0;
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix[i].length; j += 1) {
      if (matrix[i][j] > 1) {
        score += 1;
      }
    }
  }
  return score;
};

const buildMatrix = (clouds: Cloud[]) => {
  const matrix: number[][] = new Array(1000)
    .fill(0)
    .map(() => new Array(1000).fill(0));

  clouds.forEach((cloud) => {
    const diffX = Math.abs(cloud.to.x - cloud.from.x);
    const diffY = Math.abs(cloud.to.y - cloud.from.y);
    if (diffX > 0 && diffY === 0) {
      const directionX = (cloud.to.x - cloud.from.x) / diffX;
      for (let i = 0; i <= diffX; i += 1) {
        matrix[cloud.from.x + i * directionX][cloud.from.y] += 1;
      }
    }

    if (diffY > 0 && diffX === 0) {
      const directionY = (cloud.to.y - cloud.from.y) / diffY;
      for (let i = 0; i <= diffY; i += 1) {
        matrix[cloud.from.x][cloud.from.y + i * directionY] += 1;
      }
    }

    if (diffY === diffX) {
      const directionX = (cloud.to.x - cloud.from.x) / diffX;
      const directionY = (cloud.to.y - cloud.from.y) / diffY;
      for (let i = 0; i <= diffY; i += 1) {
        matrix[cloud.from.x + i * directionX][
          cloud.from.y + i * directionY
        ] += 1;
      }
    }
  });
  return matrix;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const clouds = decodeInputs(lines).filter(
    (cloud) => cloud.from.x === cloud.to.x || cloud.from.y === cloud.to.y
  );
  const matrix = buildMatrix(clouds);
  return scoreMatrix(matrix);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const clouds = decodeInputs(lines);
  const matrix = buildMatrix(clouds);
  return scoreMatrix(matrix);
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
