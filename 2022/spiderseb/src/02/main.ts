import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Input = "A" | "B" | "C";
type Hint = "X" | "Y" | "Z";
type Line = `${Input} ${Hint}`;

// Mode no brain, faut bien scorer un peu...
const computeScoreA = (player1: Input, player2: Hint): number => {
  const tokenValues: Record<Hint, number> = { X: 1, Y: 2, Z: 3 };
  let score = 0;

  score += tokenValues[player2];

  if (
    (player2 === "X" && player1 === "C") ||
    (player2 === "Y" && player1 === "A") ||
    (player2 === "Z" && player1 === "B")
  ) {
    score += 6;
  } else if (
    (player2 === "X" && player1 === "A") ||
    (player2 === "Y" && player1 === "B") ||
    (player2 === "Z" && player1 === "C")
  ) {
    score += 3;
  }
  return score;
};

const computeScoreB = (player1: Input, player2: Hint): number => {
  const tokenValues: Record<Hint, number> = { X: 0, Y: 3, Z: 6 };
  let score = 0;

  score += tokenValues[player2];

  if (
    (player1 === "A" && player2 === "Y") ||
    (player1 === "C" && player2 === "Z") ||
    (player1 === "B" && player2 === "X")
  ) {
    score += 1;
  } else if (
    (player1 === "B" && player2 === "Y") ||
    (player1 === "A" && player2 === "Z") ||
    (player1 === "C" && player2 === "X")
  ) {
    score += 2;
  } else {
    score += 3;
  }

  return score;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<Line>(inputPath);
  const score = lines.reduce((acc, current) => {
    if (!current) return acc;
    const [player1, player2] = current.split(" ") as [Input, Hint];
    return acc + computeScoreA(player1, player2);
  }, 0);
  return score;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<Line>(inputPath);
  const score = lines.reduce((acc, current) => {
    if (!current) return acc;
    const [player1, hint] = current.split(" ") as [Input, Hint];
    return acc + computeScoreB(player1, hint);
  }, 0);
  return score;
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
