import { computeBingoSum, formatData } from "./bingo/bingo.ts";

export function puzzle2(data: string[]): number {
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
  //game
  //a number is drawn
  const winningBoards: number[] = [];
  for (let h = 0; h < drawnNumbers.length; h++) {
    const drawnNumber = drawnNumbers[h];
    for (let i = 0; i < formattedBingoGrids.length; i++) {
      if (winningBoards.indexOf(i) !== -1) {
        continue;
      }
      const grid = formattedBingoGrids[i];
      for (let j = 0; j < grid.length; j++) {
        const row = grid[j];
        for (let k = 0; k < row.length; k++) {
          const scannedNumber = row[k];
          if (scannedNumber === drawnNumber) {
            resultGrid[i][j][k] = "W";
            const number = computeBingoSum(grid, resultGrid[i], drawnNumber);
            if (number) {
              winningBoards.push(i);
            }
            if (number && winningBoards.length === formattedBingoGrids.length) {
              return number;
            }
          }
        }
      }
    }
  }

  return 0;
}
