/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

class Game {
  grid: string[][] = [];

  actions: string[];

  shapeIndex: number[] = [];

  skipedRows = 0;

  shapeCount = 0;

  snapshot: { pattern: string; height: number; shapes: number }[] = [];

  rockLeft = 0;

  searchPattern = true;

  constructor(private rawInputs: string) {
    this.actions = rawInputs.split("");
  }

  getHigherRockHeight() {
    return this.grid.filter((line) => line.includes("#")).length;
  }

  addShape() {
    this.shapeCount++;
    this.rockLeft--;
    const shape = this.shapeCount % 5;
    const higherRock = this.getHigherRockHeight();
    for (let i = this.grid.length; i < higherRock + 7; i++)
      this.grid.push([" ", " ", " ", " ", " ", " ", " "]);

    switch (shape) {
      case 1:
        this.grid[this.grid.length - 4] = [" ", " ", "@", "@", "@", "@", " "];
        this.shapeIndex = [this.grid.length - 4];
        return;
      case 2:
        this.grid[this.grid.length - 2] = [" ", " ", " ", "@", " ", " ", " "];
        this.grid[this.grid.length - 3] = [" ", " ", "@", "@", "@", " ", " "];
        this.grid[this.grid.length - 4] = [" ", " ", " ", "@", " ", " ", " "];
        this.shapeIndex = [
          this.grid.length - 4,
          this.grid.length - 3,
          this.grid.length - 2,
        ];
        return;
      case 3:
        this.grid[this.grid.length - 2] = [" ", " ", " ", " ", "@", " ", " "];
        this.grid[this.grid.length - 3] = [" ", " ", " ", " ", "@", " ", " "];
        this.grid[this.grid.length - 4] = [" ", " ", "@", "@", "@", " ", " "];
        this.shapeIndex = [
          this.grid.length - 4,
          this.grid.length - 3,
          this.grid.length - 2,
        ];
        return;
      case 4:
        this.grid[this.grid.length - 1] = [" ", " ", "@", " ", " ", " ", " "];
        this.grid[this.grid.length - 2] = [" ", " ", "@", " ", " ", " ", " "];
        this.grid[this.grid.length - 3] = [" ", " ", "@", " ", " ", " ", " "];
        this.grid[this.grid.length - 4] = [" ", " ", "@", " ", " ", " ", " "];
        this.shapeIndex = [
          this.grid.length - 4,
          this.grid.length - 3,
          this.grid.length - 2,
          this.grid.length - 1,
        ];
        return;
      case 0:
        this.grid[this.grid.length - 3] = [" ", " ", "@", "@", " ", " ", " "];
        this.grid[this.grid.length - 4] = [" ", " ", "@", "@", " ", " ", " "];
        this.shapeIndex = [this.grid.length - 4, this.grid.length - 3];
        return;
      default:
        throw new Error(`Unknown shape ${shape}`);
    }
  }

  processWind(): boolean {
    if (!this.actions.length) this.actions = this.rawInputs.split("");
    const windOffset = this.actions.shift() === ">" ? 1 : -1;
    // Wind possible ?
    for (const shapeIndex of this.shapeIndex) {
      for (let cellIndex = 0; cellIndex < 7; cellIndex++) {
        if (this.grid[shapeIndex][cellIndex] === "@") {
          if (
            cellIndex + windOffset < 0 ||
            cellIndex + windOffset > 6 ||
            this.grid[shapeIndex][cellIndex + windOffset] === "#"
          )
            return false;
        }
      }
    }
    // Apply wind
    this.shapeIndex.forEach((shapeIndex) => {
      for (
        let cellIndex = windOffset > 0 ? 6 : 0;
        (windOffset > 0 && cellIndex >= 0) ||
        (windOffset < 0 && cellIndex <= 6);
        cellIndex -= windOffset
      ) {
        if (this.grid[shapeIndex][cellIndex] === "@") {
          this.grid[shapeIndex][cellIndex + windOffset] = "@";
          this.grid[shapeIndex][cellIndex] = " ";
        }
      }
    });
    return true;
  }

  fallEnd() {
    this.shapeIndex.forEach((shapeIndex) => {
      for (let cellIndex = 0; cellIndex < 7; cellIndex++)
        if (this.grid[shapeIndex][cellIndex] === "@") {
          this.grid[shapeIndex][cellIndex] = "#";
        }
    });
    if (this.searchPattern) this.findPattern();
  }

  findPattern() {
    const patternLength = 50; // arbitrary value, set greater if result is incorrect
    const currentHeight = this.getHigherRockHeight();
    if (currentHeight >= patternLength) {
      const pattern = this.grid
        .slice(currentHeight - patternLength, currentHeight)
        .map((line) => line.join(""))
        .join("");

      const previousSnapshot = this.snapshot.find(
        (snapshot) => snapshot.pattern === pattern
      );
      if (previousSnapshot) {
        const deltaShape = this.shapeCount - previousSnapshot.shapes;
        const deltaHeight = currentHeight - previousSnapshot.height;
        const cycles = Math.floor(this.rockLeft / deltaShape);
        console.log(
          `after ${this.shapeCount} shapes, found a pattern of ${deltaShape} shapes, ${deltaHeight} height. Add ${cycles} cycles`
        );
        this.rockLeft -= cycles * deltaShape;
        this.skipedRows += cycles * deltaHeight;
        this.searchPattern = false;
      } else {
        this.snapshot.push({
          pattern,
          height: currentHeight,
          shapes: this.shapeCount,
        });
      }
    }
  }

  fall(): boolean {
    // fall possible ?
    for (const shapeIndex of this.shapeIndex) {
      if (shapeIndex === 0) {
        this.fallEnd();
        return false;
      }
      for (let cellIndex = 0; cellIndex < 7; cellIndex++) {
        if (this.grid[shapeIndex][cellIndex] === "@") {
          if (this.grid[shapeIndex - 1][cellIndex] === "#") {
            this.fallEnd();
            return false;
          }
        }
      }
    }
    // Fall
    this.shapeIndex.forEach((shapeIndex) => {
      for (let cellIndex = 0; cellIndex < 7; cellIndex++) {
        if (this.grid[shapeIndex][cellIndex] === "@") {
          this.grid[shapeIndex - 1][cellIndex] = "@";
          this.grid[shapeIndex][cellIndex] = " ";
        }
      }
    });
    this.shapeIndex = this.shapeIndex.map((i) => i - 1);
    return true;
  }

  getTotalHeight() {
    return this.getHigherRockHeight() + this.skipedRows;
  }

  showGrid(clear = false) {
    if (clear) console.clear();

    console.log(
      this.grid
        .map((line) => `|${line.join("")}|`)
        .reverse()
        .join("\n")
    );
  }

  async showFrame(interval: number) {
    return new Promise((res) => {
      this.showGrid(true);
      setTimeout(() => {
        res(true);
      }, interval);
    });
  }

  async play(rockAmount = 1, visualizationRate = 0) {
    this.rockLeft = rockAmount;
    while (this.rockLeft > 0) {
      this.addShape();
      if (visualizationRate) await this.showFrame(visualizationRate);
      let fall = true;
      while (fall) {
        this.processWind();
        if (visualizationRate) await this.showFrame(visualizationRate);

        fall = this.fall();
        if (visualizationRate) await this.showFrame(visualizationRate);
      }
    }
  }
}

const resolveFirstPuzzle = async (
  inputPath: string,
  rockAmount: number,
  visualizationRate = 0
) => {
  const rawInputs = (await readInputs<string>(inputPath))[0];

  const game = new Game(rawInputs);
  await game.play(rockAmount, visualizationRate);
  return game.getTotalHeight();
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH, 2022); // Add 100 in third param to see video
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolveFirstPuzzle(INPUT_PATH, 2022);
  console.log("## RESULT 1 ##", result1);

  const result2Test = await resolveFirstPuzzle(TEST_INPUT_PATH, 1000000000000);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveFirstPuzzle(INPUT_PATH, 1000000000000);
  console.log("## RESULT 2 ##", result2);
};

main().catch((error) => console.error(error));
