import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const parseFile = (filename: string) =>
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), filename).replace(
      /\/dist\//g,
      "/src/",
    ),
    "utf-8",
  );

const inputTest = parseFile("input.test.txt");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let rangesStr = "";
  const ranges: [number, number][] = [];
  do {
    rangesStr = lines.shift() || "";
    if (rangesStr === "") break;

    ranges.push(rangesStr.split("-").map(Number) as [number, number]);
  } while (rangesStr !== "");

  console.log(ranges);

  const ids = lines.map(Number);

  let result = 0;

  for (const id of ids) {
    let fresh = false;
    for (const [min, max] of ranges) {
      if (id >= min && id <= max) {
        fresh = true;
        break;
      }
    }
    if (fresh) {
      result++;
    }
  }
  return result;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let rangesStr = "";
  const ranges: [number, number][] = [];
  do {
    rangesStr = lines.shift() || "";
    if (rangesStr === "") break;

    ranges.push(rangesStr.split("-").map(Number) as [number, number]);
  } while (rangesStr !== "");

  console.log(ranges);

  const finalRanges: [number, number][] = [ranges.shift() as [number, number]];
  for (const [newMin, newMax] of ranges) {
    console.log(`Inserting range ${newMin}-${newMax}`);
    let replaced = false;

    for (let i = finalRanges.length - 1; i >= 0; i--) {
      const [min, max] = finalRanges[i];
      console.log(` Comparing to final range ${min}-${max}`);
      if (newMin > max) {
        console.log("after");
        replaced = true;
        finalRanges.splice(i + 1, 0, [newMin, newMax]);
        break;
      } else if (newMin >= min) {
        if (newMax <= max) {
          // contained
          console.log("contained");
          replaced = true;
          break;
        } else {
          console.log("extending end");
          // extend end
          finalRanges.splice(i, 1, [min, newMax]);
          replaced = true;
          break;
        }
      } else {
        // newMin < min
        // eslint-disable-next-line no-lonely-if
        if (newMax >= max) {
          // extend both
          console.log("extending both");
          finalRanges.splice(i, 1, [newMin, newMax]);
          replaced = true;
        } else if (newMax >= min) {
          // extend start
          console.log("extending start");
          finalRanges.splice(i, 1, [newMin, max]);
          replaced = true;
        }
      }
    }
    if (!replaced) {
      console.log("before");
      finalRanges.splice(0, 0, [newMin, newMax]);
    }
    console.log(finalRanges);

    for (let i = 0; i < finalRanges.length - 1; i++) {
      const [min1, max1] = finalRanges[i];
      const [min2, max2] = finalRanges[i + 1];
      if (max1 >= min2) {
        console.log(
          ` Merging final ranges ${min1}-${max1} and ${min2}-${max2}`,
        );
        finalRanges.splice(i, 2, [Math.min(min1, min2), Math.max(max1, max2)]);
        i--;
      }
    }
  }

  console.log(finalRanges);

  let result = 0;
  for (const [min, max] of finalRanges) {
    result += max - min + 1;
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
