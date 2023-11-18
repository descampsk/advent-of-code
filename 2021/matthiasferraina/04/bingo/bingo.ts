export function formatData(data: string[]) {
  const drawnNumbers = data[0].split(",").map(Number);
  const gridDimension = 5;
  const bingoGrids = data
    .splice(1)
    .map((el) => el.split(" ").filter((el) => el !== ""))
    .map((el) => el.map(Number));

  const formattedBingoGrids: number[][][] = [];

  bingoGrids.forEach((element: number[]) => {
    const formattedGrid: number[][] = [];
    for (let index = 0; index < gridDimension; index++) {
      formattedGrid.push(
        element.slice(
          0 + index * gridDimension,
          gridDimension + index * gridDimension
        )
      );
    }
    formattedBingoGrids.push(formattedGrid);
  });

  const resultGrid: string[][][] = formattedBingoGrids.map((el) =>
    el.map((el) => el.map(String))
  );
  return { drawnNumbers, formattedBingoGrids, resultGrid };
}

export const assertArrayIsBingo = (array: string[]): boolean => {
  const expectedTokens = array.length;
  const tokensCount = array.reduce(
    (acc, curr) => (curr === "W" ? acc + 1 : acc),
    0
  );
  return tokensCount === expectedTokens;
};

export const assertGridIsBingo = (grid: string[][]): boolean => {
  let bingo = false;
  for (let index = 0; index < grid.length; index++) {
    const element = grid[index];
    bingo = assertArrayIsBingo(element);
    if (bingo) {
      return bingo;
    }
  }

  const transposedGrid = transposeArray(grid);
  for (let index = 0; index < transposedGrid.length; index++) {
    const element = transposedGrid[index];
    bingo = assertArrayIsBingo(element);
    if (bingo) {
      return bingo;
    }
  }
  return bingo;
};

export const computeBingoSum = (
  bingoGrid: number[][],
  bingoResult: string[][],
  drawnNumber: number
): number | null => {
  if (!assertGridIsBingo(bingoResult)) {
    return null;
  }

  let count = 0;
  for (let rowIndex = 0; rowIndex < bingoGrid.length; rowIndex++) {
    const row = bingoGrid[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const element = row[colIndex];
      if (bingoResult[rowIndex][colIndex] !== "W") {
        count += element;
      }
    }
  }

  return count * drawnNumber || null;
};

export const transposeArray = <T>(array: T[][]): T[][] => {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
};
