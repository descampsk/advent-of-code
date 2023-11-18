import run from "aocrunner";
import BigNumber from "bignumber.js";
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

type Monkey = {
  id: number;
  items: BigNumber[];
  operation: {
    right: number | "old";
    type: "+" | "*";
  };
  divisible: number;
  monkeyTrue: number;
  monkeyFalse: number;
  inspection: number;
};

const getMonkeys = (lines: string[]) => {
  const numberOfMonkeys = (lines.length + 1) / 7;
  const monkeys: Monkey[] = [];
  for (let i = 0; i < numberOfMonkeys; i++) {
    const lineNumber = i * 7;
    const id = i;
    const startingItemLine = lines[lineNumber + 1];
    const items = startingItemLine
      .split(": ")[1]
      .split(", ")
      .map((value) => new BigNumber(parseInt(value, 10)));
    const operationLine = lines[lineNumber + 2];
    let type = "" as "+" | "*";
    if (operationLine.includes("+")) {
      type = "+";
    } else if (operationLine.includes("*")) {
      type = "*";
    } else {
      throw new Error(`Type not found for this line ${operationLine}`);
    }

    const rightMatch = operationLine.match(/[0-9]+$/);
    const right = (rightMatch ? parseInt(rightMatch[0], 10) : "old") as
      | number
      | "old";

    const divisibleLine = lines[lineNumber + 3];
    const divisibleMatch = divisibleLine.match(/[0-9]+$/);
    const divisible = divisibleMatch ? parseInt(divisibleMatch[0], 10) : null;

    const monkeyTrueLine = lines[lineNumber + 4];
    const monkeyTrueMatch = monkeyTrueLine.match(/[0-9]+$/);
    const monkeyTrue = monkeyTrueMatch
      ? parseInt(monkeyTrueMatch[0], 10)
      : null;

    const monkeyFalseLine = lines[lineNumber + 5];
    const monkeyFalseMatch = monkeyFalseLine.match(/[0-9]+$/);
    const monkeyFalse = monkeyFalseMatch
      ? parseInt(monkeyFalseMatch[0], 10)
      : null;

    if (monkeyFalse === null || monkeyTrue === null || divisible === null) {
      console.log(monkeyFalse, monkeyTrue, divisible);
      throw new Error("wrong input");
    }

    monkeys.push({
      id,
      divisible,
      items,
      monkeyFalse,
      monkeyTrue,
      operation: {
        right,
        type,
      },
      inspection: 0,
    });
  }
  return monkeys;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const monkeys = getMonkeys(lines);
  console.log(monkeys);
  const round = 20;
  const numberOfMonkeys = monkeys.length;
  for (let i = 0; i < round; i++) {
    for (let j = 0; j < numberOfMonkeys; j++) {
      const monkey = monkeys[j];
      const { items, operation, divisible, monkeyFalse, monkeyTrue } = monkey;
      while (items.length) {
        monkey.inspection += 1;
        const item = items.shift();
        if (!item) throw new Error("item is empty");
        let newItem = item;
        const rightValue =
          operation.right === "old" ? newItem : operation.right;
        if (operation.type === "*") {
          newItem = newItem
            .multipliedBy(rightValue)
            .dividedBy(3)
            .integerValue(BigNumber.ROUND_DOWN);
        } else {
          newItem = newItem
            .plus(rightValue)
            .dividedBy(3)
            .integerValue(BigNumber.ROUND_DOWN);
        }
        if (newItem.modulo(divisible).eq(new BigNumber(0))) {
          monkeys[monkeyTrue].items.push(newItem);
        } else {
          monkeys[monkeyFalse].items.push(newItem);
        }
      }
    }
  }
  console.log(monkeys);
  const monkeySortedByInspection = monkeys.sort(
    (a, b) => b.inspection - a.inspection,
  );
  return (
    monkeySortedByInspection[0].inspection *
    monkeySortedByInspection[1].inspection
  );
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const monkeys = getMonkeys(lines);
  const divsibleByAll = monkeys.reduce(
    (modulo, monkey) => modulo * monkey.divisible,
    1,
  );
  const round = 10000;
  const numberOfMonkeys = monkeys.length;
  for (let i = 0; i < round; i++) {
    for (let j = 0; j < numberOfMonkeys; j++) {
      const monkey = monkeys[j];
      const { items, operation, divisible, monkeyFalse, monkeyTrue } = monkey;
      while (items.length) {
        monkey.inspection += 1;
        const item = items.shift();
        if (!item) throw new Error("item is empty");
        let newItem = item;
        const rightValue =
          operation.right === "old" ? newItem : operation.right;
        if (operation.type === "*") {
          newItem = newItem
            .multipliedBy(rightValue)
            .integerValue(BigNumber.ROUND_DOWN);
        } else {
          newItem = newItem.plus(rightValue).integerValue(BigNumber.ROUND_DOWN);
        }
        const megaModulo = newItem.modulo(divsibleByAll);
        if (newItem.modulo(divisible).eq(new BigNumber(0))) {
          monkeys[monkeyTrue].items.push(megaModulo);
        } else {
          monkeys[monkeyFalse].items.push(megaModulo);
        }
      }
    }
  }
  console.log(monkeys.map((monkey) => monkey.inspection));
  const monkeySortedByInspection = monkeys.sort(
    (a, b) => b.inspection - a.inspection,
  );
  console.log(monkeySortedByInspection.map((monkey) => monkey.inspection));
  return (
    monkeySortedByInspection[0].inspection *
    monkeySortedByInspection[1].inspection
  );
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
