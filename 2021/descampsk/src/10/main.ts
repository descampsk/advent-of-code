import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;
const POSSIBLE_CHUNCK: Record<string, string> = {
  "}": "{",
  "]": "[",
  ">": "<",
  ")": "(",
};

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const decoded = lines.map((line) => [...line]);
  return decoded;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  let sum = 0;
  for (let i = 0; i < decodedInputs.length; i += 1) {
    const openChunks = [];
    for (let j = 0; j < decodedInputs[i].length; j += 1) {
      const chunk = decodedInputs[i][j];
      if (Object.values(POSSIBLE_CHUNCK).includes(chunk)) {
        openChunks.push(chunk);
      } else {
        const openChunk = POSSIBLE_CHUNCK[chunk];
        if (openChunks[openChunks.length - 1] !== openChunk) {
          switch (chunk) {
            case ")":
              sum += 3;
              break;
            case "]":
              sum += 57;
              break;
            case "}":
              sum += 1197;
              break;
            case ">":
              sum += 25137;
              break;
            default:
              break;
          }
          break;
        } else {
          openChunks.pop();
        }
      }
    }
  }
  return sum;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await decodeInput(inputPath);
  const scores: number[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const openChunks = [];
    let isCorrupted = false;
    for (let j = 0; j < lines[i].length; j += 1) {
      const chunk = lines[i][j];
      if (Object.values(POSSIBLE_CHUNCK).includes(chunk)) {
        openChunks.push(chunk);
      } else {
        const openChunk = POSSIBLE_CHUNCK[chunk];
        if (openChunks[openChunks.length - 1] !== openChunk) {
          isCorrupted = true;
          break;
        } else {
          openChunks.pop();
        }
      }
    }
    if (!isCorrupted && lines[i].length) {
      let score = 0;
      for (let j = 0; j < openChunks.length; j += 1) {
        score *= 5;
        const chunk = openChunks[openChunks.length - 1 - j];
        switch (chunk) {
          case "(":
            score += 1;
            break;
          case "[":
            score += 2;
            break;
          case "{":
            score += 3;
            break;
          case "<":
            score += 4;
            break;
          default:
            break;
        }
      }
      scores.push(score);
    }
  }
  return scores.sort((a, b) => a - b)[Math.ceil(scores.length / 2) - 1];
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
