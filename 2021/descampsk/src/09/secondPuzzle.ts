import { decodeInput } from "./main";

const isLowPoint = (x: number, y: number, matrix: number[][]): boolean => {
  const point = matrix[x][y];
  if (
    (x < matrix.length - 1 && matrix[x + 1][y] <= point) ||
    (x > 0 && matrix[x - 1][y] <= point) ||
    (y < matrix[x].length - 1 && matrix[x][y + 1] <= point) ||
    (y > 0 && matrix[x][y - 1] <= point)
  ) {
    return false;
  }
  return true;
};

const findLowestLocation = (
  x: number,
  y: number,
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  matrix: number[][]
): { x: number; y: number } | false => {
  const point = matrix[x][y];
  if (
    point === 9 ||
    x < 0 ||
    y < 0 ||
    x >= matrix.length ||
    y >= matrix[x].length
  ) {
    return false;
  }

  if (isLowPoint(x, y, matrix)) {
    return { x, y };
  }

  if (down && x < matrix.length - 1 && matrix[x + 1][y] <= point) {
    const location = findLowestLocation(
      x + 1,
      y,
      false,
      true,
      true,
      true,
      matrix
    );
    if (location) {
      return location;
    }
  }

  if (up && x > 0 && matrix[x - 1][y] <= point) {
    const location = findLowestLocation(
      x - 1,
      y,
      true,
      false,
      true,
      true,
      matrix
    );
    if (location) {
      return location;
    }
  }

  if (right && y < matrix[x].length - 1 && matrix[x][y + 1] <= point) {
    const location = findLowestLocation(
      x,
      y + 1,
      true,
      true,
      false,
      true,
      matrix
    );
    if (location) {
      return location;
    }
  }

  if (left && y > 0 && matrix[x][y - 1] <= point) {
    const location = findLowestLocation(
      x,
      y - 1,
      true,
      true,
      true,
      false,
      matrix
    );
    if (location) {
      return location;
    }
  }

  return false;
};

export const resolveSecondPuzzle = async (inputPath: string) => {
  const matrix = await decodeInput(inputPath);
  const bassins: Record<string, number> = {};
  for (let x = 0; x < matrix.length; x += 1) {
    for (let y = 0; y < matrix[x].length; y += 1) {
      const location = findLowestLocation(x, y, true, true, true, true, matrix);
      if (location) {
        const locationKey = `${location.x}${location.y}`;
        if (bassins[locationKey]) {
          bassins[locationKey] += 1;
        } else {
          bassins[locationKey] = 1;
        }
      }
    }
  }

  const values = Object.values(bassins).sort((a, b) => b - a);
  const sum = values[0] * values[1] * values[2];

  return sum;
};
