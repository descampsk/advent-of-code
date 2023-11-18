/* eslint-disable max-classes-per-file */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

class Monkey {
  // eslint-disable-next-line no-use-before-define
  monkeys: Monkey[] = [];

  stack: number[] = [];

  divisionTest: number;

  monkeyTestTrue: number;

  monkeyTestFalse: number;

  decreaseWorry: boolean;

  compute: (item: number) => number;

  score = 0;

  constructor(lines: string[], decreaseWorry: boolean, monkeys: Monkey[]) {
    this.monkeys = monkeys;
    this.stack = lines[0].match(/([0-9]+)/g)?.map(Number) || [];
    const operation = lines[1].substring(19);
    if (operation === "old * old") {
      this.compute = (item: number) => item * item;
    } else {
      const match = operation.match(/([0-9]+)/g);
      const factor = Number(match?.[0]);
      if (operation.includes("*")) {
        this.compute = (item: number) => item * factor;
      } else {
        this.compute = (item: number) => item + factor;
      }
    }
    this.divisionTest = Number(lines[2].substring(21));
    this.monkeyTestTrue = Number(lines[3].substring(29));
    this.monkeyTestFalse = Number(lines[4].substring(30));
    this.decreaseWorry = decreaseWorry;
  }

  playTurn() {
    const numberReducer = this.monkeys.reduce(
      (acc, current) =>
        acc ? acc * current.divisionTest : current.divisionTest,
      0
    );

    while (this.stack.length) {
      this.score++;
      let item = this.stack.shift() as number;
      item = this.compute(item);
      if (this.decreaseWorry) {
        item = Math.floor(Number(item) / 3);
      } else {
        // To avoid number explosion, you can divide item value by product of all monkeys testdivider
        item %= numberReducer;
      }
      if (item % this.divisionTest === 0) {
        this.monkeys[this.monkeyTestTrue].stack.push(item);
      } else {
        this.monkeys[this.monkeyTestFalse].stack.push(item);
      }
    }
  }
}

class Monkeys {
  monkeys: Monkey[] = [];

  constructor(lines: string[], decreaseWorry: boolean) {
    for (let i = 0; i < lines.length; i += 7) {
      this.monkeys.push(
        new Monkey(lines.slice(i + 1, i + 6), decreaseWorry, this.monkeys)
      );
    }
  }

  playRound() {
    this.monkeys.forEach((monkey) => monkey.playTurn());
  }

  getScore(rounds: number) {
    for (let round = 1; round <= rounds; round++) this.playRound();
    const scores: number[] = [];
    this.monkeys.forEach((monkey) => scores.push(monkey.score));
    scores.sort((a, b) => b - a);
    return scores[0] * scores[1];
  }
}
const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const monkeys = new Monkeys(lines, true);
  return monkeys.getScore(20);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const monkeys = new Monkeys(lines, false);
  return monkeys.getScore(10000);
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
