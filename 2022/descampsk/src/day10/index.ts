import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let indexLine = 0;
  let cycle = 1;
  let X = 1;
  const signalStrenghs: Record<number, number> = { 1: 1 };
  while (cycle < 220) {
    const line = lines[indexLine];
    if (line === "noop") {
      indexLine += 1;
      cycle += 1;
      signalStrenghs[cycle] = X;
    } else {
      const [add, Vstr] = line.split(" ");
      const V = parseInt(Vstr, 10);
      for (let i = 0; i < 1; i++) {
        cycle += 1;
        signalStrenghs[cycle] = X;
      }
      cycle += 1;
      indexLine += 1;
      X += V;
      signalStrenghs[cycle] = X;
    }
  }

  return (
    20 * signalStrenghs[20] +
    60 * signalStrenghs[60] +
    100 * signalStrenghs[100] +
    140 * signalStrenghs[140] +
    180 * signalStrenghs[180] +
    220 * signalStrenghs[220]
  );
};

const printPixel = (
  pixels: string[],
  cycle: number,
  spritePosition: number,
) => {
  if (Math.abs(((cycle - 1) % 40) - spritePosition) <= 1) {
    pixels.push("#");
  } else {
    pixels.push(".");
  }
};

const showPixels = (pixels: string[]) => {
  for (let i = 0; i < 6; i++) {
    const line = pixels.slice(i * 40, i * 40 + 40);
    console.log(line.join(""));
  }
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const pixels: string[] = [];
  let spritePosition = 1;
  let cycle = 1;
  lines.forEach((line) => {
    if (line === "noop") {
      printPixel(pixels, cycle, spritePosition);
      cycle += 1;
    } else {
      const [add, Vstr] = line.split(" ");
      const V = parseInt(Vstr, 10);
      printPixel(pixels, cycle, spritePosition);
      cycle += 1;
      printPixel(pixels, cycle, spritePosition);
      cycle += 1;
      spritePosition += V;
    }
  });
  showPixels(pixels);
  return 0;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
