import { decodeInput } from "./main";

const computeSumRecursive = (
  sum: number,
  x: number,
  y: number,
  onlyHorizontal: boolean,
  inputs: number[][]
): number => {
  if (x < 0 || y < 0) {
    return 0;
  }

  const point = inputs[x][y];
  // Find if [x,y] is low point
  if (
    (x < inputs.length - 1 && inputs[x + 1][y] <= point) ||
    (x > 0 && inputs[x - 1][y] <= point) ||
    (y < inputs[x].length - 1 && inputs[x][y + 1] <= point) ||
    (y > 0 && inputs[x][y - 1] <= point)
  ) {
    if (onlyHorizontal) {
      return sum + computeSumRecursive(sum, x - 1, y, true, inputs);
    }

    return (
      sum +
      computeSumRecursive(sum, x - 1, y, true, inputs) +
      computeSumRecursive(sum, x, y - 1, false, inputs)
    );
  }

  if (onlyHorizontal) {
    return 1 + point + sum + computeSumRecursive(sum, x - 1, y, true, inputs);
  }

  return (
    1 +
    point +
    sum +
    computeSumRecursive(sum, x - 1, y, true, inputs) +
    computeSumRecursive(sum, x, y - 1, false, inputs)
  );
};

// eslint-disable-next-line import/prefer-default-export
export const resolveFirstPuzzle = async (inputPath: string) => {
  const matrix = await decodeInput(inputPath);
  const sum = computeSumRecursive(
    0,
    matrix.length - 1,
    matrix[0].length - 1,
    false,
    matrix
  );
  return sum;
};
