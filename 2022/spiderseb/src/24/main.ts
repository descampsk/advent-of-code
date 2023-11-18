/* eslint-disable no-restricted-syntax */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Position = [row: number, col: number];
type Wind = {
  position: Position;
  direction: ">" | "<" | "^" | "v";
};

class Puzzle {
  winds: Wind[];

  width: number;

  height: number;

  constructor(inputs: string[]) {
    this.width = inputs[0].length;
    this.height = inputs.length;
    this.winds = inputs.reduce((acc: Wind[], line, row) => {
      line.split("").forEach((cell, col) => {
        if ("><^v".includes(cell)) {
          acc.push({
            position: [row, col],
            direction: cell as Wind["direction"],
          });
        }
      });
      return acc;
    }, []);
  }

  moveWind() {
    for (const wind of this.winds) {
      if (wind.direction === "<") {
        wind.position[1] =
          wind.position[1] > 1 ? wind.position[1] - 1 : this.width - 2;
      } else if (wind.direction === ">") {
        wind.position[1] =
          wind.position[1] < this.width - 2 ? wind.position[1] + 1 : 1;
      } else if (wind.direction === "v") {
        wind.position[0] =
          wind.position[0] < this.height - 2 ? wind.position[0] + 1 : 1;
      } else {
        wind.position[0] =
          wind.position[0] > 1 ? wind.position[0] - 1 : this.height - 2;
      }
    }
  }

  moveElf(pos: Position): Position[] {
    const possiblePos: Position[] = [];
    if (!this.hasWind(pos)) possiblePos.push(pos);
    if (pos[0] < this.height - 2 && !this.hasWind([pos[0] + 1, pos[1]]))
      possiblePos.push([pos[0] + 1, pos[1]]);
    if (pos[0] > 1 && !this.hasWind([pos[0] - 1, pos[1]]))
      possiblePos.push([pos[0] - 1, pos[1]]);
    if (
      pos[0] > 0 &&
      pos[0] < this.height - 1 &&
      pos[1] < this.width - 2 &&
      !this.hasWind([pos[0], pos[1] + 1])
    )
      possiblePos.push([pos[0], pos[1] + 1]);
    if (
      pos[0] > 0 &&
      pos[0] < this.height - 1 &&
      pos[1] > 1 &&
      !this.hasWind([pos[0], pos[1] - 1])
    )
      possiblePos.push([pos[0], pos[1] - 1]);
    return possiblePos;
  }

  hasWind(target: Position): boolean {
    return this.winds.some(
      ({ position: p }) => p[0] === target[0] && p[1] === target[1]
    );
  }

  timeToGo(from: Position, to: Position): number {
    let time = 0;
    let currentPos: Position[] = [from];

    while (currentPos.length) {
      time++;
      this.moveWind();
      const nextPos: Position[] = []; // no better perf with a Set and string key
      for (const pos of currentPos) {
        const nextElfMoves = this.moveElf(pos);
        for (const nextElfMove of nextElfMoves) {
          if (
            !nextPos.some(
              (p) => p[0] === nextElfMove[0] && p[1] === nextElfMove[1]
            )
          ) {
            nextPos.push(nextElfMove);
            if (
              (nextElfMove[0] === to[0] &&
                Math.abs(nextElfMove[1] - to[1]) === 1) ||
              (nextElfMove[1] === to[1] &&
                Math.abs(nextElfMove[0] - to[0]) === 1)
            ) {
              this.moveWind();
              return time + 1;
            }
          }
        }
      }
      currentPos = [...nextPos];
    }
    return 0;
  }
}

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const puzzle = new Puzzle(lines);
  return puzzle.timeToGo([0, 1], [puzzle.height - 1, puzzle.width - 2]);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const puzzle = new Puzzle(lines);

  const firstRun = puzzle.timeToGo(
    [0, 1],
    [puzzle.height - 1, puzzle.width - 2]
  );
  const goBack = puzzle.timeToGo([puzzle.height - 1, puzzle.width - 2], [0, 1]);
  const secondRun = puzzle.timeToGo(
    [0, 1],
    [puzzle.height - 1, puzzle.width - 2]
  );

  return firstRun + goBack + secondRun;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test); // 18
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1); // 247

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test); // 54
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2); // 728
};

main().catch((error) => console.error(error));
