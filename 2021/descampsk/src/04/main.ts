import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = (lines: string[]) => {
  const bingo = lines[0].split(",").map((number) => parseInt(number, 10));
  const boards: Record<number, number[][]> = {};
  let boardNumber = 0;
  for (let i = 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (line !== "") {
      const lineNumbers = line
        .split(/ {2}| /g)
        .filter((number) => number)
        .map((number) => parseInt(number, 10));
      if (boards[boardNumber]) {
        boards[boardNumber].push(lineNumbers);
      } else {
        boards[boardNumber] = [lineNumbers];
      }
    } else {
      boardNumber += 1;
    }
  }
  return {
    bingo,
    boards,
  };
};

const isBoardWinner = (board: number[][]) => {
  for (let i = 0; i < board.length; i += 1) {
    let lineSum = 0;
    let columnSum = 0;
    for (let j = 0; j < board[i].length; j += 1) {
      lineSum += board[i][j];
      columnSum += board[j][i];
      if (lineSum === board.length * -1 || columnSum === board.length * -1) {
        return true;
      }
    }
  }
  return false;
};

const removeBingoNumberFromBoard = (board: number[][], bingoNumber: number) => {
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      if (board[i][j] === bingoNumber) {
        // eslint-disable-next-line no-param-reassign
        board[i][j] = -1;
      }
    }
  }
  return false;
};

const calculateScoreBoard = (board: number[][], bingoNumber: number) => {
  let score = 0;
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board[i].length; j += 1) {
      if (board[i][j] !== -1) {
        score += board[i][j];
      }
    }
  }
  return score * bingoNumber;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const { bingo, boards } = decodeInput(lines);

  for (let i = 0; i < bingo.length; i += 1) {
    const bingoNumber = bingo[i];
    const boardsArray = Object.values(boards);
    for (let j = 0; j < boardsArray.length; j += 1) {
      const board = boardsArray[j];
      removeBingoNumberFromBoard(board, bingoNumber);
      if (isBoardWinner(board)) {
        console.log("Winner", board);
        return calculateScoreBoard(board, bingoNumber);
      }
    }
  }
  return 0;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const { bingo, boards } = decodeInput(lines);
  const totalBoards = Object.values(boards).length;

  const boardWinners: number[] = [];
  for (let i = 0; i < bingo.length; i += 1) {
    const bingoNumber = bingo[i];
    Object.entries(boards).forEach(([boardNumber, board]) => {
      removeBingoNumberFromBoard(board, bingoNumber);
      if (isBoardWinner(board)) {
        boardWinners.push(parseInt(boardNumber, 10));
      }
    });
    if (boardWinners.length === totalBoards) {
      const loserBoard = boards[boardWinners[boardWinners.length - 1]];
      console.log("Winner", loserBoard);
      return calculateScoreBoard(loserBoard, bingoNumber);
    }
    boardWinners.forEach((boardWinner) => {
      delete boards[boardWinner];
    });
  }
  return 0;
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
