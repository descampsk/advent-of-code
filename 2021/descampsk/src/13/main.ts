import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);

  const points = lines
    .map((line) => line.split(",").map((number) => parseInt(number, 10)))
    .filter((point) => point.length === 2);

  const folds = lines
    .map((line) => line.split("="))
    .filter((line) => line.length === 2)
    .map((line) => ({
      direction: line[0].slice(-1),
      where: parseInt(line[1], 10),
    }));

  return {
    points,
    folds,
  };
};

const fold = (
  { direction, where }: { direction: string; where: number },
  points: number[][]
) => {
  const newPoints = [...points];
  if (direction === "y") {
    for (let i = 0; i < points.length; i++) {
      if (newPoints[i][1] > where) {
        newPoints[i][1] = where * 2 - newPoints[i][1];
      }
    }
  } else {
    for (let i = 0; i < points.length; i++) {
      if (newPoints[i][0] > where) {
        newPoints[i][0] = where * 2 - newPoints[i][0];
      }
    }
  }
  return newPoints
    .filter((elem, pos) => {
      for (let i = 0; i < newPoints.length; i++) {
        if (
          pos < i &&
          elem[0] === newPoints[i][0] &&
          elem[1] === newPoints[i][1]
        ) {
          return false;
        }
      }
      return true;
    })
    .sort();
};

const showPoints = (points: number[][]) => {
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  const matrix = new Array(maxX + 1)
    .fill(".")
    .map(() => new Array(maxY + 1).fill("."));

  points.forEach((point) => {
    matrix[point[0]][point[1]] = "#";
  });
  let matrixString = "";
  for (let i = 0; i < matrix[0].length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      matrixString = `${matrixString}${matrix[j][i]}`;
    }
    matrixString = `${matrixString}\n`;
  }
  console.log(matrixString);
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const { points, folds } = await decodeInput(inputPath);
  const newPoints = fold(folds[0], points);
  return newPoints.length;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const { points, folds } = await decodeInput(inputPath);
  let newPoints = [...points];
  folds.forEach((foldToDo) => {
    newPoints = [...fold(foldToDo, newPoints)];
  });
  showPoints(newPoints);
  return newPoints;
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
