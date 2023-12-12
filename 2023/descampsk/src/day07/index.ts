import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { max } from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

const testFile2 = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.2.txt",
).replace(/\/dist\//g, "/src/");
const inputTest2 = readFileSync(testFile2, "utf-8");

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

const sortLines =
  (isPart2 = false) =>
  (a: string, b: string) => {
    const handA = [...a.split(" ")[0]] as Card[];
    const handB = [...b.split(" ")[0]] as Card[];
    // console.log(handA, handB);
    const mapA: { [key: string]: number } = {};
    const mapB: { [key: string]: number } = {};
    for (let i = 0; i < handA.length; i++) {
      if (!mapA[handA[i]]) {
        mapA[handA[i]] = 1;
      } else {
        mapA[handA[i]]!++;
      }

      if (!mapB[handB[i]]) {
        mapB[handB[i]] = 1;
      } else {
        mapB[handB[i]]!++;
      }
    }

    if (isPart2) {
      if (mapA.J) {
        let maxLetter: string | undefined;
        let maxLetterValue = 0;
        for (const [letter, value] of Object.entries(mapA)) {
          if (value > maxLetterValue && letter !== "J") {
            maxLetter = letter;
            maxLetterValue = value;
          }
        }
        if (maxLetter) {
          mapA[maxLetter] += mapA.J;
          delete mapA.J;
        }
      }
      if (mapB.J) {
        let maxLetter: string | undefined;
        let maxLetterValue = 0;
        for (const [letter, value] of Object.entries(mapB)) {
          if (value > maxLetterValue && letter !== "J") {
            maxLetter = letter;
            maxLetterValue = value;
          }
        }
        if (maxLetter) {
          mapB[maxLetter] += mapB.J;
          delete mapB.J;
        }
      }
    }

    // console.log(mapA, mapB);

    const maxCardsA = Object.values(mapA).sort((x, y) => y - x);
    const maxCardsB = Object.values(mapB).sort((x, y) => y - x);
    const max1A = maxCardsA[0];
    const max2A = maxCardsA[1];
    const max1B = maxCardsB[0];
    const max2B = maxCardsB[1];

    // console.log(max1A, max2A, max1B, max2B);

    // Si le max de carte d'un joueur est supérieur à l'autre, il gagne
    if (max1A !== max1B) {
      return max1A - max1B;
    }
    // Si le max de carte est égal, on regarde le deuxième max
    if (max2A !== max2B) {
      return max2A - max2B;
    }

    // Si les deux max sont égaux, on regarde la carte la plus haute
    const heads = {
      A: 14,
      K: 13,
      Q: 12,
      J: isPart2 ? 0 : 11,
      T: 10,
      "9": 9,
      "8": 8,
      "7": 7,
      "6": 6,
      "5": 5,
      "4": 4,
      "3": 3,
      "2": 2,
    };

    // Si les deux cartes les plus hautes sont égaux, on regarde les cartes dans l'ordre
    for (let i = 0; i < handA.length; i++) {
      // console.log("last", handA[i], handB[i]);

      if (handA[i] !== handB[i]) {
        return heads[handA[i]] - heads[handB[i]];
      }
    }
    return 0;
  };

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const sortedLines = lines.sort(sortLines(false));
  console.log(sortedLines.slice(900), sortedLines.length);

  return sortedLines.reduce((total, line, index) => {
    // console.log(line);
    const bid = Number.parseInt(line.split(" ")[1], 10);
    return total + (index + 1) * bid;
  }, 0);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const sortedLines = lines.sort(sortLines(true));
  console.log(sortedLines.slice(0), sortedLines.length);

  return sortedLines.reduce((total, line, index) => {
    // console.log(line);
    const bid = Number.parseInt(line.split(" ")[1], 10);
    return total + (index + 1) * bid;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 6440,
      },
      {
        input: inputTest2,
        expected: 251058093,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 5905,
      },
      {
        input: inputTest2,
        expected: 249781879,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
