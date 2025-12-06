import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const operations = lines.pop()!.split(/\s+/).filter(Boolean);

  const matrix: number[][] = lines.map((line) =>
    line.split(/\s+/).filter(Boolean).map(Number),
  );

  console.log(operations);

  let finalResult = 0;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    let result = matrix[0][i];
    for (let r = 1; r < matrix.length; r++) {
      if (op === "+") {
        result += matrix[r][i];
      } else if (op === "*") {
        result *= matrix[r][i];
      }
    }
    finalResult += result;
  }

  return finalResult;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const maxLength = Math.max(...lines.map((line) => line.length));
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].padEnd(maxLength, " ");
  }

  const operationsStr = lines.pop()!;
  const operations: { operator: string; length: number }[] = [];

  let lengthToAdd = 0;
  let operator = "";
  for (let i = 0; i < operationsStr.length; i++) {
    const char = operationsStr[i];
    if (char !== " ") {
      if (operator !== "") {
        operations.push({ operator, length: lengthToAdd - 1 });
      }
      lengthToAdd = 1;
      operator = char;
    } else {
      lengthToAdd++;
    }
  }
  operations.push({ operator, length: lengthToAdd });

  console.log(operations);

  const matrix: string[][] = operations.map(() => []);
  for (const line of lines) {
    let cursor = 0;
    for (let i = 0; i < operations.length; i++) {
      const { length } = operations[i];
      const numsStr = line.slice(cursor, cursor + length);
      matrix[i].push(numsStr);
      cursor += length + 1;
    }
  }

  console.log(matrix);

  let finalResult = 0;
  for (let i = 0; i < operations.length; i++) {
    const { operator, length } = operations[i];

    const numbers = matrix[i];
    console.log(`Processing column ${i} with operator ${operator}:`, {
      numbers,
    });

    let result = operator === "+" ? 0 : 1;
    for (let j = 0; j < length; j++) {
      let numberStr = "";
      for (let k = 0; k < numbers.length; k++) {
        numberStr += numbers[k][j];
      }
      const number = Number(numberStr.trim());
      console.log(` Extracted number: ${number}`);
      result = operator === "+" ? result + number : result * number;
    }
    console.log(` Result for column ${i}: ${result}`);
    finalResult += result;
  }

  return finalResult;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
