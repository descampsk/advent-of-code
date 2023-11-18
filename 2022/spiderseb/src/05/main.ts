import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

// Build each stack in reverse order: last stack element have index 0
const buildStacks = (lines: string[]) => {
  const stacks: string[][] = [[], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j <= 8; j++) {
      const cellIndex = j * 4 + 1;
      if (lines[i][cellIndex] && lines[i][cellIndex] !== " ")
        stacks[j + 1].push(lines[i][cellIndex]);
    }
  }
  return stacks;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const stacks = buildStacks(lines);

  // Move
  for (let i = 10; i < lines.length; i++) {
    const [, move, , from, , to] = lines[i].split(" ").map(Number);
    const stackToMove = stacks[from].splice(0, move).reverse();
    stacks[to].unshift(...stackToMove);
  }

  return stacks.map((stack) => stack[0]).join("");
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const stacks = buildStacks(lines);

  // Move
  for (let i = 10; i < lines.length; i++) {
    const [, move, , from, , to] = lines[i].split(" ").map(Number);
    const stackToMove = stacks[from].splice(0, move);
    stacks[to].unshift(...stackToMove);
  }

  return stacks.map((stack) => stack[0]).join("");
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
