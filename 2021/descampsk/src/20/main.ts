import { kMaxLength } from "buffer";
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const printMatrix = (matrix: string[][]) => {
  for (let i = 0; i < matrix.length; i++) {
    console.log(matrix[i].map((value) => value).join(""));
  }
};

const addEmptyLines = (matrix: string[][]) => {
  const newMatrix: string[][] = [];
  for (let i = 0; i < matrix.length + 5; i++) {
    const newLine = [];
    if (i < 0 || i >= matrix.length) {
      newLine.push(...new Array(matrix[0].length + 10).fill("."));
    } else {
      for (let j = -5; j < matrix[i].length + 5; j++) {
        if (j < 0 || j >= matrix[i].length) {
          newLine.push(".");
        } else {
          newLine.push(matrix[i][j]);
        }
      }
    }
    newMatrix.push(newLine);
  }
  return newMatrix;
};

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();

  const algo = lines[0];

  lines.shift();
  lines.shift();

  const matrix: string[][] = [];
  for (let i = -60; i < lines.length + 60; i++) {
    const newLine = [];
    if (i < 0 || i >= lines.length) {
      newLine.push(...new Array(lines[0].length + 120).fill("."));
    } else {
      for (let j = -60; j < lines[i].length + 60; j++) {
        if (j < 0 || j >= lines[i].length) {
          newLine.push(".");
        } else {
          newLine.push(lines[i].charAt(j));
        }
      }
    }
    matrix.push(newLine);
  }
  // printMatrix(matrix);
  return { algo, matrix };
};

const emptyTransformation = (algo: string, round: number) => {
  const allEmptyTransformation = algo[0];
  const allFullTransformation = algo[algo.length - 1];
  let infinityPixel = ".";
  for (let i = 0; i < round; i++) {
    if (infinityPixel === ".") {
      infinityPixel = allEmptyTransformation;
    } else {
      infinityPixel = allFullTransformation;
    }
  }
  return infinityPixel;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const { algo, matrix } = await decodeInput(inputPath);
  let oldMatrix = matrix.map((line) => [...line]);
  for (let k = 0; k < 50; k++) {
    const newMatrix = oldMatrix.map((line) => [...line]);
    const infinityPixel = emptyTransformation(algo, k);
    for (let i = 0; i < oldMatrix.length; i++) {
      for (let j = 0; j < oldMatrix[i].length; j++) {
        let firstLine = [];
        if (i === 0) {
          firstLine = [infinityPixel, infinityPixel, infinityPixel];
        } else if (j === 0) {
          firstLine = [infinityPixel, ...oldMatrix[i - 1].slice(j, j + 2)];
        } else if (j === oldMatrix[i].length - 1) {
          firstLine = [...oldMatrix[i - 1].slice(j - 1, j + 1), infinityPixel];
        } else {
          firstLine = oldMatrix[i - 1].slice(j - 1, j + 2);
        }
        let secondLine = [];
        if (j === 0) {
          secondLine = [infinityPixel, ...oldMatrix[i].slice(j, j + 2)];
        } else if (j === oldMatrix[i].length - 1) {
          secondLine = [...oldMatrix[i].slice(j - 1, j + 1), infinityPixel];
        } else {
          secondLine = oldMatrix[i].slice(j - 1, j + 2);
        }
        let thirdLine = [];
        if (i === oldMatrix.length - 1) {
          thirdLine = [infinityPixel, infinityPixel, infinityPixel];
        } else if (j === 0) {
          thirdLine = [infinityPixel, ...oldMatrix[i + 1].slice(j, j + 2)];
        } else if (j === oldMatrix[i].length - 1) {
          thirdLine = [...oldMatrix[i + 1].slice(j - 1, j + 1), infinityPixel];
        } else {
          thirdLine = oldMatrix[i + 1].slice(j - 1, j + 2);
        }
        const fullLine = [...firstLine, ...secondLine, ...thirdLine];
        const binary = fullLine.map((char) => (char === "#" ? 1 : 0)).join("");
        const number = parseInt(binary, 2);
        const newPixel = algo[number];
        // console.log(i, j, binary, newPixel);
        newMatrix[i][j] = newPixel;
      }
    }
    oldMatrix = newMatrix.map((line) => [...line]);
    // console.log(k);
    // printMatrix(oldMatrix);
  }
  let pixel = 0;
  for (let i = 1; i < oldMatrix.length - 1; i++) {
    for (let j = 1; j < oldMatrix[i].length - 1; j++) {
      if (oldMatrix[i][j] === "#") {
        pixel++;
      }
    }
  }
  return pixel;
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

  // const resultSecondPuzzleTest = await resolveSecondPuzzle(TEST_INPUT_PATH);
  // console.log(
  //   "The result of the second puzzle test is:",
  //   resultSecondPuzzleTest
  // );
  // const resultSecondPuzzle = await resolveSecondPuzzle(INPUT_PATH);
  // console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
