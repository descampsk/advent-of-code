import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const snafuToDecimalDigit = (snafu: string): number => {
  switch (snafu) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "=":
      return -2;
    case "-":
      return -1;
    default:
      throw new Error(`cannot parse snafu char: ${snafu}`);
  }
};
const snafuToDecimal = (snafu: string): number => {
  const decomposedSnafu = snafu.split("").reverse();

  return decomposedSnafu.reduce((acc, current, index) => {
    return acc + snafuToDecimalDigit(current) * 5 ** index;
  }, 0);
};
const decimalToSnafuDigit = (
  decimal: number
): [snafuDigit: string, nextDigit: number] => {
  switch (decimal) {
    case 0:
      return ["0", 0];
    case 1:
      return ["1", 0];
    case 2:
      return ["2", 0];
    case 3:
      return ["=", 1];
    case 4:
      return ["-", 1];
    case 5:
      return ["0", 1];
    default:
      throw new Error(`cannot parse decimal: ${decimal}`);
  }
};
const decimalToSnafu = (decimal: number): string => {
  let i = 1;
  let nextDigit = 0;
  let snafuDigit = "";
  let processed = 0;
  const decomposedSnafu: string[] = [];
  while (processed !== decimal) {
    const digit = (decimal % 5 ** i) - processed;
    [snafuDigit, nextDigit] = decimalToSnafuDigit(
      digit / 5 ** (i - 1) + nextDigit
    );
    decomposedSnafu.push(snafuDigit);
    processed += digit;
    i++;
  }
  return decomposedSnafu.reverse().join("");
};

const resolvePuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const sum = lines.reduce((acc, current) => acc + snafuToDecimal(current), 0);
  return decimalToSnafu(sum);
};

const main = async () => {
  const result1Test = await resolvePuzzle(TEST_INPUT_PATH);
  console.log("##  TEST  ##", result1Test); // 2=-1=0
  const result1 = await resolvePuzzle(INPUT_PATH);
  console.log("## RESULT ##", result1); // 2-00=12=21-0=01--000
};

main().catch((error) => console.error(error));
