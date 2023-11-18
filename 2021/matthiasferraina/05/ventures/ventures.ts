type Point = {
  x: number;
  y: number;
};

type Grid = number[][];
export function formatLine(line: string): Point[] {
  const formattedLine: Point[] = [];
  const tmp = line.split(" -> ").map((el) => el.split(",").map(Number));
  tmp.forEach((coordinate: number[]) => {
    formattedLine.push({ x: coordinate[0], y: coordinate[1] });
  });
  return formattedLine;
}

export function formatLines(lines: string[]): Point[][] {
  const formattedLines: Point[][] = [];
  lines.forEach((line: string) => {
    formattedLines.push(formatLine(line));
  });

  return formattedLines;
}

export function filterHorizontalAndVerticalLines(lines: Point[][]): Point[][] {
  return lines.filter(
    (line: Point[]) => line[0].x === line[1].x || line[0].y === line[1].y,
  );
}

export function filterHorizontalAndVerticalAndDiagonalLines(
  lines: Point[][],
): Point[][] {
  return lines.filter(
    (line: Point[]) =>
      line[0].x === line[1].x ||
      line[0].y === line[1].y ||
      Math.abs(line[0].x - line[1].x) === Math.abs(line[0].y - line[1].y),
  );
}

export function drawVentures(lines: Point[][], grid: Grid): Grid {
  const newGrid: Grid = [...grid];
  lines.forEach((line: Point[]) => {
    if (line[0].y === line[1].y) {
      const lineLength = Math.abs(line[0].x - line[1].x);
      for (let i = 0; i <= lineLength; i++) {
        newGrid[line[0].y][Math.min(line[0].x, line[1].x) + i] += 1;
      }
    } else if (line[0].x === line[1].x) {
      const lineLength = Math.abs(line[0].y - line[1].y);
      for (let i = 0; i <= lineLength; i++) {
        newGrid[Math.min(line[0].y, line[1].y) + i][line[0].x] += 1;
      }
    } else if (
      Math.abs(line[0].x - line[1].x) === Math.abs(line[0].y - line[1].y)
    ) {
      const diagonalLength = Math.abs(line[0].y - line[1].y);
      for (let i = 0; i <= diagonalLength; i++) {
        if (line[0].x < line[1].x) {
          if (line[0].y < line[1].y) {
            newGrid[line[0].y + i][line[0].x + i] += 1;
          } else {
            newGrid[line[0].y - i][line[0].x + i] += 1;
          }
        } else {
          if (line[0].y > line[1].y) {
            newGrid[line[0].y - i][line[0].x - i] += 1;
          } else {
            newGrid[line[0].y + i][line[0].x - i] += 1;
          }
        }
      }
    }
  });
  return newGrid;
}

export function generateGridOfNDimension(dimension: number): Grid {
  const arr = Array<number>(dimension).fill(0);
  const newArr = [];
  for (let index = 0; index < dimension; index++) {
    newArr.push([...arr]);
  }
  return newArr;
}
