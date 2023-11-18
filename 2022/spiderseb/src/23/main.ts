/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Position = [row: number, col: number];
type Direction = "N" | "S" | "E" | "W";

class Puzzle {
  grid: string[][];

  readonly EMPTY = ".";

  readonly ELF = "#";

  constructor(lines: string[], private part = 1) {
    this.grid = lines.map((line) => line.split(""));
  }

  extendGrid() {
    if (this.grid[0].some((cell) => cell === this.ELF)) {
      this.grid.unshift(Array(this.grid[0].length).fill(this.EMPTY));
    }
    if (this.grid[this.grid.length - 1].some((cell) => cell === this.ELF)) {
      this.grid.push(Array(this.grid[0].length).fill(this.EMPTY));
    }
    if (this.grid.some((line) => line[0] === this.ELF)) {
      this.grid.forEach((line) => {
        line.unshift(this.EMPTY);
      });
    }
    if (this.grid.some((line) => line.at(-1) === this.ELF)) {
      this.grid.forEach((line) => {
        line.push(this.EMPTY);
      });
    }
  }

  compressGrid() {
    if (!this.grid[0].some((cell) => cell === this.ELF)) {
      this.grid.shift();
    }
    if (!this.grid[this.grid.length - 1].some((cell) => cell === this.ELF)) {
      this.grid.pop();
    }
    if (!this.grid.some((line) => line[0] === this.ELF)) {
      this.grid.forEach((line) => {
        line.shift();
      });
    }
    if (!this.grid.some((line) => line.at(-1) === this.ELF)) {
      this.grid.forEach((line) => {
        line.pop();
      });
    }
  }

  sumEmptyCells() {
    return this.grid
      .map((line) => line.join(""))
      .join("")
      .split("")
      .filter((cell) => cell === this.EMPTY).length;
  }

  hasAdjacent(row: number, col: number): boolean {
    return (
      this.grid[row - 1][col] === this.ELF ||
      this.grid[row - 1][col - 1] === this.ELF ||
      this.grid[row - 1][col + 1] === this.ELF ||
      this.grid[row + 1][col] === this.ELF ||
      this.grid[row + 1][col - 1] === this.ELF ||
      this.grid[row + 1][col + 1] === this.ELF ||
      this.grid[row][col - 1] === this.ELF ||
      this.grid[row][col + 1] === this.ELF
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getTargetPositions(
    row: number,
    col: number,
    direction: Direction
  ): [number, number][] {
    if (direction === "N") {
      return [
        [row - 1, col],
        [row - 1, col - 1],
        [row - 1, col + 1],
      ];
    }
    if (direction === "S") {
      return [
        [row + 1, col],
        [row + 1, col - 1],
        [row + 1, col + 1],
      ];
    }
    if (direction === "E") {
      return [
        [row, col + 1],
        [row - 1, col + 1],
        [row + 1, col + 1],
      ];
    }
    return [
      [row, col - 1],
      [row - 1, col - 1],
      [row + 1, col - 1],
    ];
  }

  resolve(maxRound = 10): number {
    const moveOrder: Direction[] = ["N", "S", "W", "E"];
    for (let round = 1; round <= maxRound; round++) {
      this.extendGrid();

      // Plan moves
      const moves: Record<string, Position[]> = {};
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          if (this.grid[row][col] === this.EMPTY) continue;
          if (!this.hasAdjacent(row, col)) continue;

          for (const direction of moveOrder) {
            const positions = this.getTargetPositions(row, col, direction);
            if (
              positions.length &&
              positions.every((pos) => this.grid[pos[0]][pos[1]] === this.EMPTY)
            ) {
              const key = `${positions[0][0]}-${positions[0][1]}`;
              if (moves[key]) {
                moves[key].push([row, col]);
              } else {
                moves[key] = [[row, col]];
              }
              break; // break for
            }
          }
        }
      }

      // Part 2 : return the round where no elf move
      if (!Object.keys(moves).length && this.part === 2) return round;

      // Do moves
      for (const key in moves) {
        if (moves[key].length > 1) continue;
        const [newRow, newCol] = key.split("-").map(Number);
        const [oldRow, oldCol] = moves[key][0];
        this.grid[newRow][newCol] = this.ELF;
        this.grid[oldRow][oldCol] = this.EMPTY;
      }

      // Move rotation
      moveOrder.push(moveOrder.shift()!);
    }
    this.compressGrid();
    this.compressGrid();
    // Part 1 : return number of empty cells
    return this.sumEmptyCells();
  }
}

const resolvePuzzle = async (inputPath: string, part: number) => {
  const lines = await readInputs<string>(inputPath);
  const puzzle = new Puzzle(lines, part);
  const sum = puzzle.resolve(part === 1 ? 10 : 999999);
  return sum;
};

const main = async () => {
  const result1Test = await resolvePuzzle(TEST_INPUT_PATH, 1);
  console.log("##  TEST 1  ##", result1Test); // 110
  const result1 = await resolvePuzzle(INPUT_PATH, 1);
  console.log("## RESULT 1 ##", result1); // 4247

  const result2Test = await resolvePuzzle(TEST_INPUT_PATH, 2);
  console.log("##  TEST 2  ##", result2Test); // 20
  const result2 = await resolvePuzzle(INPUT_PATH, 2);
  console.log("## RESULT 2 ##", result2); // 1049
};

main().catch((error) => console.error(error));
