/* eslint-disable max-classes-per-file */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const specialCycles = [20, 60, 100, 140, 180, 220];
  let cycle = 0;
  let X = 1;
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const [action, param] = lines[i].split(" ");
    if (action === "noop") {
      cycle++;
    } else {
      cycle += 2;
      if (cycle >= specialCycles[0]) {
        sum += specialCycles[0] * X;
        specialCycles.shift();
        if (!specialCycles.length) return sum;
      }
      X += Number(param);
    }
  }

  return 0;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  let X = 1;
  const output = ["", "", "", "", "", ""];
  let currentLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const [action, param] = lines[i].split(" ");
    if (action === "noop") {
      // 1 cycle
      if (Math.abs(X - output[currentLine].length) <= 1) {
        output[currentLine] += "#";
      } else {
        output[currentLine] += ".";
      }
      if (output[currentLine].length === 40) currentLine++;
    } else {
      // 2 cycle
      if (Math.abs(X - output[currentLine].length) <= 1) {
        output[currentLine] += "#";
      } else {
        output[currentLine] += ".";
      }
      if (output[currentLine].length === 40) currentLine++;
      if (Math.abs(X - output[currentLine].length) <= 1) {
        output[currentLine] += "#";
      } else {
        output[currentLine] += ".";
      }
      if (output[currentLine].length === 40) currentLine++;

      X += Number(param);
    }
  }

  return output;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1);

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2);
};

main().catch((error) => console.error(error));
