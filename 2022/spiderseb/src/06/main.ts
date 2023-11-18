import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = (await readInputs<string>(inputPath))[0] || "";
  for (let i = 0; i < lines.length - 4; i++) {
    const test = new Set(lines.substring(i, i + 4));
    if (test.size === 4) return i + 4;
  }
  return 0;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = (await readInputs<string>(inputPath))[0] || "";
  for (let i = 0; i < lines.length - 14; i++) {
    const test = new Set(lines.substring(i, i + 14));
    if (test.size === 14) return i + 14;
  }
  return 0;
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
