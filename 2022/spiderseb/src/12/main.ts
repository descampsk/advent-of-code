import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

type Position = [number, number];

class PathFinder {
  grid: string[][];

  path: number[][];

  proposedStart: Position;

  target: Position;

  pathNumber = 0;

  nextPathPoints: Position[] = [];

  constructor(lines: string[]) {
    this.grid = lines.map((line) => line.split(""));
    this.path = lines.map((line) =>
      line.replace(/./g, "0").split("").map(Number)
    );
    const endLine = lines.findIndex((line) => line.includes("E"));
    const endCol = this.grid[endLine].findIndex((cell) => cell === "E");
    this.target = [endLine, endCol];
    this.grid[endLine][endCol] = "z";

    const startLine = lines.findIndex((line) => line.includes("S"));
    const startCol = this.grid[startLine].findIndex((cell) => cell === "S");
    this.proposedStart = [startLine, startCol];
    this.grid[startLine][startCol] = "a";
  }

  solvePath(all?: "anyStartingPoint") {
    let currentPathPoints: Position[] = [];
    while (!this.path[this.target[0]][this.target[1]]) {
      if (!this.pathNumber) {
        if (all) {
          for (let x = 0; x < this.grid.length; x++)
            for (let y = 0; y < this.grid[x].length; y++)
              if (this.grid[x][y] === "a") currentPathPoints.push([x, y]);
        } else {
          currentPathPoints.push(this.proposedStart);
        }
      } else {
        currentPathPoints = [...this.nextPathPoints];
        this.nextPathPoints = [];
      }
      this.pathNumber++;
      currentPathPoints.forEach(([x, y]) => {
        if (x > 0) this.tryToGo([x, y], [x - 1, y]);
        if (y > 0) this.tryToGo([x, y], [x, y - 1]);
        if (x < this.path.length - 1) this.tryToGo([x, y], [x + 1, y]);
        if (y < this.path[x].length - 1) this.tryToGo([x, y], [x, y + 1]);
      });
    }

    return this.path[this.target[0]][this.target[1]];
  }

  tryToGo(start: Position, dest: Position) {
    if (!this.path[dest[0]][dest[1]] && this.canGo(start, dest)) {
      this.path[dest[0]][dest[1]] = this.pathNumber;
      this.nextPathPoints.push(dest);
    }
  }

  canGo([startX, startY]: Position, [destX, destY]: Position): boolean {
    return (
      this.grid[destX][destY].charCodeAt(0) -
        this.grid[startX][startY].charCodeAt(0) <=
      1
    );
  }
}

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const pathFinder = new PathFinder(lines);
  return pathFinder.solvePath();
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const pathFinder = new PathFinder(lines);
  return pathFinder.solvePath("anyStartingPoint");
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
