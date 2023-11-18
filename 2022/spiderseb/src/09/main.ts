/* eslint-disable max-classes-per-file */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

class Head {
  x = 0;

  y = 0;

  move(direction: string) {
    if (direction === "U") this.x -= 1;
    if (direction === "D") this.x += 1;
    if (direction === "L") this.y -= 1;
    if (direction === "R") this.y += 1;
  }
}

class BodyPart {
  x = 0;

  y = 0;

  // eslint-disable-next-line no-useless-constructor
  constructor(private previousPart: Head | BodyPart) {}

  move() {
    if (
      Math.abs(this.x - this.previousPart.x) <= 1 &&
      Math.abs(this.y - this.previousPart.y) <= 1
    )
      return;

    if (this.previousPart.x > this.x) {
      this.x++;
    } else if (this.previousPart.x < this.x) {
      this.x--;
    }
    if (this.previousPart.y > this.y) {
      this.y++;
    } else if (this.previousPart.y < this.y) {
      this.y--;
    }
  }
}

class Snake {
  head: Head;

  bodyParts: BodyPart[] = [];

  constructor(size: number) {
    this.head = new Head();
    for (let i = 0; i < size; i++)
      this.bodyParts.push(
        new BodyPart(i === 0 ? this.head : this.bodyParts[i - 1])
      );
  }

  move(direction: string) {
    this.head.move(direction);
    this.bodyParts.forEach((bodyPart) => bodyPart.move());
  }

  getTailPosition() {
    const tail = this.bodyParts[this.bodyParts.length - 1];
    return `${tail.x}.${tail.y}`;
  }
}

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const snake = new Snake(1);
  const moves = new Set<string>([snake.getTailPosition()]);

  lines.forEach((move) => {
    const [direction, steps] = move.split(" ");
    for (let i = 0; i < Number(steps); i++) {
      snake.move(direction);
      moves.add(snake.getTailPosition());
    }
  });

  return moves.size;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const snake = new Snake(9);
  const moves = new Set<string>([snake.getTailPosition()]);

  lines.forEach((move) => {
    const [direction, steps] = move.split(" ");
    for (let step = 0; step < Number(steps); step++) {
      snake.move(direction);
      moves.add(snake.getTailPosition());
    }
  });

  return moves.size;
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
