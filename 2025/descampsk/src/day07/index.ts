import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Terminal } from "command-line-draw";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const parseFile = (filename: string) =>
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), filename).replace(
      /\/dist\//g,
      "/src/",
    ),
    "utf-8",
  );

const inputTest = parseFile("input.test.txt");

const printMatrix = (matrix: string[][]) => {
  for (const row of matrix) {
    console.log(row.join(""));
  }
};

const displayMatrix = (matrix: string[][], terminal: Terminal) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const block = matrix[i][j];

      if (["S", "^"].includes(block)) terminal.write(matrix[i][j], j, i, "red");
      else if (block === "|") terminal.write(matrix[i][j], j, i, "yellow");
      else terminal.write(matrix[i][j], j, i, "white");
    }
  }
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix = lines.map((line) => line.split(""));

  console.clear();

  // const terminal = new Terminal({
  //   width: matrix[0].length,
  //   height: matrix.length,
  // });
  // displayMatrix(matrix, terminal);
  printMatrix(matrix);

  const splitPos = new Set<string>();

  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = 0; j < matrix[i].length - 1; j++) {
      const current = matrix[i][j];
      if (current === "S") {
        matrix[i + 1][j] = "|";
      } else if (current === "|") {
        if (matrix[i + 1][j] === "^") {
          splitPos.add(`${i},${j}`);
          if (j - 1 >= 0) {
            matrix[i + 1][j - 1] = "|";
          }
          if (j + 1 < matrix[i].length) {
            matrix[i + 1][j + 1] = "|";
          }
        } else {
          matrix[i + 1][j] = "|";
        }
      }
    }
    // displayMatrix(matrix, terminal);
    printMatrix(matrix);
  }

  return splitPos.size;
};

const printMatrixWithTimeline = (
  matrix: { block: string; timeline: number }[][],
) => {
  for (const row of matrix) {
    console.log(row.map((cell) => cell.block).join(""));
  }
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const matrix: { block: string; timeline: number }[][] = lines.map((line) =>
    line.split("").map((block) => ({ block, timeline: 0 })),
  );

  console.clear();

  // const terminal = new Terminal({
  //   width: matrix[0].length,
  //   height: matrix.length,
  // });
  // displayMatrix(matrix, terminal);
  printMatrixWithTimeline(matrix);

  const timelines: Record<string, number> = {};

  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const current = matrix[i][j].block;
      const currentTimeline = matrix[i][j].timeline;
      if (current === "S") {
        matrix[i + 1][j] = { block: "|", timeline: 1 };
      } else if (current === "|") {
        if (matrix[i + 1][j].block === "^") {
          if (j - 1 >= 0) {
            matrix[i + 1][j - 1] = {
              block: "|",
              timeline: currentTimeline + matrix[i + 1][j - 1].timeline,
            };
          }
          if (j + 1 < matrix[i].length) {
            matrix[i + 1][j + 1] = {
              block: "|",
              timeline: currentTimeline + matrix[i + 1][j + 1].timeline,
            };
          }
        } else {
          matrix[i + 1][j] = {
            block: "|",
            timeline: currentTimeline + matrix[i + 1][j].timeline,
          };
        }
      }

      console.log(matrix[i][j]);
    }
    // displayMatrix(matrix, terminal);
    printMatrixWithTimeline(matrix);
    console.log("Timelines:", timelines);
  }

  let totalTimelines = 0;
  for (let i = 0; i < matrix[0].length; i++) {
    console.log(matrix[matrix.length - 1][i]);
    totalTimelines += matrix[matrix.length - 1][i].timeline;
  }

  return totalTimelines;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
