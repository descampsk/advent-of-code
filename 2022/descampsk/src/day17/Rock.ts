/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
type Block = {
  x: number;
  y: number;
};

export type RockType = "line" | "I" | "L" | "cross" | "cube";

export const rockOrder: RockType[] = ["line", "cross", "L", "I", "cube"];

export abstract class Rock {
  blocks: Block[] = [];

  type: RockType = "I";

  isBlocked = false;

  isBlockedLeft(blocked: Map<number, Set<number>>) {
    for (const block of this.blocks) {
      if (block.x === 0 || blocked.get(block.y)?.has(block.x - 1)) {
        return true;
      }
    }
    return false;
  }

  isBlockedRight(widght: number, blocked: Map<number, Set<number>>) {
    for (const block of this.blocks) {
      if (block.x === widght - 1 || blocked.get(block.y)?.has(block.x + 1)) {
        return true;
      }
    }
    return false;
  }

  moveLeft() {
    this.blocks.forEach((block) => {
      block.x -= 1;
    });
  }

  moveRight() {
    this.blocks.forEach((block) => {
      block.x += 1;
    });
  }

  moveDown() {
    this.blocks.forEach((block) => {
      block.y -= 1;
    });
  }
}

export class Line extends Rock {
  constructor(y: number) {
    super();
    this.type = "line";
    const initialPosition = [
      {
        x: 2,
        y,
      },
      {
        x: 3,
        y,
      },
      {
        x: 4,
        y,
      },
      {
        x: 5,
        y,
      },
    ];
    this.blocks = initialPosition;
  }
}

export class Cross extends Rock {
  constructor(y: number) {
    super();
    this.type = "cross";
    const initialPosition = [
      {
        x: 3,
        y,
      },
      {
        x: 2,
        y: y + 1,
      },
      {
        x: 3,
        y: y + 1,
      },
      {
        x: 4,
        y: y + 1,
      },
      {
        x: 3,
        y: y + 2,
      },
    ];
    this.blocks = initialPosition;
  }
}

export class L extends Rock {
  constructor(y: number) {
    super();
    this.type = "L";
    const initialPosition = [
      {
        x: 2,
        y,
      },
      {
        x: 3,
        y,
      },
      {
        x: 4,
        y,
      },
      {
        x: 4,
        y: y + 1,
      },
      {
        x: 4,
        y: y + 2,
      },
    ];
    this.blocks = initialPosition;
  }
}

export class I extends Rock {
  constructor(y: number) {
    super();
    this.type = "I";
    const initialPosition = [
      {
        x: 2,
        y,
      },
      {
        x: 2,
        y: y + 1,
      },
      {
        x: 2,
        y: y + 2,
      },
      {
        x: 2,
        y: y + 3,
      },
    ];
    this.blocks = initialPosition;
  }
}

export class Cube extends Rock {
  constructor(y: number) {
    super();
    this.type = "cube";
    const initialPosition = [
      {
        x: 2,
        y,
      },
      {
        x: 3,
        y,
      },
      {
        x: 2,
        y: y + 1,
      },
      {
        x: 3,
        y: y + 1,
      },
    ];
    this.blocks = initialPosition;
  }
}

export const createRock = (type: RockType, y: number): Rock => {
  if (type === "I") return new I(y);
  if (type === "L") return new L(y);
  if (type === "cross") return new Cross(y);
  if (type === "cube") return new Cube(y);
  if (type === "line") return new Line(y);
  throw new Error("no type found");
};
