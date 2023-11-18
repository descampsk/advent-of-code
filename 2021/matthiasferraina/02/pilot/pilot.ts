type Position = {
  horizontal: number;
  depth: number;
  aim?: number;
};

export enum Command {
  "FORWARD" = "forward",
  "UP" = "up",
  "DOWN" = "down",
}

export function pilot(commands: [Command, string][]): number {
  const position: Position = {
    horizontal: 0,
    depth: 0,
  };

  for (let index = 0; index < commands.length; index++) {
    const [instruction, moveQuantity] = commands[index];

    switch (instruction) {
      case Command.FORWARD:
        position.horizontal += formatMove(moveQuantity);
        break;
      case Command.UP:
        position.depth -= formatMove(moveQuantity);
        break;
      case Command.DOWN:
        position.depth += formatMove(moveQuantity);
        break;
      default:
        break;
    }
  }
  return position.depth * position.horizontal;
}

export function pilotAndAim(commands: [Command, string][]): number {
  const position: Position = {
    horizontal: 0,
    depth: 0,
    aim: 0,
  };

  if (position.aim===undefined) {
    return 0;
  }

  for (let index = 0; index < commands.length; index++) {
    const [instruction, moveQuantity] = commands[index];

    switch (instruction) {
      case Command.FORWARD:
        position.horizontal += formatMove(moveQuantity);
        position.depth += position?.aim * formatMove(moveQuantity);
        break;
      case Command.UP:
        position.aim -= formatMove(moveQuantity);
        break;
      case Command.DOWN:
        position.aim += formatMove(moveQuantity);
        break;
      default:
        break;
    }
  }

  return position.depth * position.horizontal;
}

export const formatMove = (value: string): number => parseInt(value, 10);
