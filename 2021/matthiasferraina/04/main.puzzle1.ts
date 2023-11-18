import { formatData,computeBingoSum } from "./bingo/bingo.ts";

export function puzzle1(data: string[]): number {
  // format data
  const {
    drawnNumbers,
    formattedBingoGrids,
    resultGrid,
  }: {
    drawnNumbers: number[];
    formattedBingoGrids: number[][][];
    resultGrid: string[][][];
  } = formatData(data);

  // game
  // a number is drawn
  for (let h = 0; h < drawnNumbers.length; h++) {
    const drawnNumber = drawnNumbers[h];
    for (let i = 0; i < formattedBingoGrids.length; i++) {
      const grid = formattedBingoGrids[i];
      for (let j = 0; j < grid.length; j++) {
        const row = grid[j];
        for (let k = 0; k < row.length; k++) {
          const scannedNumber = row[k];
          if (scannedNumber === drawnNumber) {
            resultGrid[i][j][k] = "W";
            const number = computeBingoSum(grid, resultGrid[i], drawnNumber);
            if (number) {
              return number;
            }
          }
        }
      }
    }
  }

  return 0;
}


