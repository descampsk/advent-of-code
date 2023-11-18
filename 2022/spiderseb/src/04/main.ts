import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const sum = lines.reduce((acc, line) => {
    if (!line) return acc;
    const [[elf1from, elf1to], [elf2from, elf2to]] = line
      .split(",")
      .map((elf) => elf.split("-").map(Number));

    if (
      (elf1from >= elf2from && elf1to <= elf2to) ||
      (elf1from <= elf2from && elf1to >= elf2to)
    )
      return acc + 1;
    return acc;
  }, 0);
  return sum;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const sum = lines.reduce((acc, line) => {
    if (!line) return acc;
    const [[elf1from, elf1to], [elf2from, elf2to]] = line
      .split(",")
      .map((elf) => elf.split("-").map(Number));

    if (
      (elf1from >= elf2from && elf1from <= elf2to) ||
      (elf1to >= elf2from && elf1to <= elf2to) ||
      (elf2from >= elf1from && elf2from <= elf1to) ||
      (elf2to >= elf1from && elf2to <= elf1to)
    )
      return acc + 1;
    return acc;
  }, 0);
  return sum;
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
