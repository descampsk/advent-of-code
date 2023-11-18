import { readFileSync } from "fs";

function getTarget(): number[][] {
  const line = readFileSync("./17-guilde/data.txt", "utf-8");
  const split: string[] = line.replace("target area: x=", "").split(", y=");
  const target = split.map((elem) => {
    return elem.split("..").map((num) => parseInt(num, 10));
  });
  return target;
}

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

function createMatrix(
  nbCols: number,
  nbRows: number,
  origin: number,
  points: number[][],
  target: number[][]
): string[] {
  const matrix = [];
  for (let i = 0; i < nbRows; i++) {
    let s = "";
    for (let j = 0; j < nbCols; j++) {
      s += ".";
    }
    matrix.push(s);
  }
  const [[xMin, xMax], [yMin, yMax]] = target;
  for (let i = xMin; i <= xMax; i++) {
    for (let j = yMin; j <= yMax; j++) {
      const x = i;
      const y = origin - j;
      const char = "T";
      matrix[y] = setCharAt(matrix[y], x, char);
    }
  }
  for (const p of points) {
    const x = p[0];
    const y = origin - p[1];
    const char = "#";
    matrix[y] = setCharAt(matrix[y], x, char);
  }
  matrix[origin] = setCharAt(matrix[origin], 0, "S");

  return matrix;
}

function displayMatrix(matrix: string[]): void {
  for (const row of matrix) {
    console.log(row);
  }
}

function step(x: number, y: number, vx: number, vy: number) {
  x += vx;
  y += vy;
  // vx = vx ? ((Math.abs(vx) - 1) * vx) / Math.abs(vx) : 0;
  if (vx < 0) {
    vx += 1;
  } else if (vx > 0) {
    vx -= 1;
  }
  vy -= 1;
  return [x, y, vx, vy];
}

function attempt(
  vx: number,
  vy: number,
  points: number[][],
  target: number[][]
) {
  const [[xMin, xMax], [yMin, yMax]] = target;
  let x = 0;
  let y = 0;
  let yReach = 0;
  while (y >= yMin) {
    [x, y, vx, vy] = step(x, y, vx, vy);
    points.push([x, y]);
    if (vy == 0) {
      yReach = y;
    }
    if (xMin <= x && x <= xMax && yMin <= y && y <= yMax) {
      return [true, yReach];
    }
  }
  return [false, null];
}

function getMaxRowAndColumn(points: number[][], target: number[][]) {
  const [[xMin, xMax], [yMin, yMax]] = target;
  const allX = points.map((point) => point[0]);
  allX.push(xMin, xMax);
  const allY = points.map((point) => point[1]);
  allY.push(yMin, yMax);
  const nbCols = Math.max(...allX) - Math.min(...allX) + 1;
  const nbRows = Math.max(...allY) - Math.min(...allY) + 1;
  const origin = Math.max(...allY);
  return [nbCols, nbRows, origin];
}

function main(vx: number, vy: number) {
  const target: number[][] = getTarget();
  const points: number[][] = [[0, 0]];
  const [result, yReach] = attempt(vx, vy, points, target);
  const [nbCols, nbRows, origin] = getMaxRowAndColumn(points, target);
  const matrix = createMatrix(nbCols, nbRows, origin, points, target);
  displayMatrix(matrix);
  return [result, yReach];
}
main(6, 9);

// let nbResults = 0;
// const [[xMin, xMax], [yMin, yMax]] = getTarget();
// for (let vx = 0; vx <= xMax; vx++) {
//   for (let vy = yMin; vy <= Math.abs(yMin); vy++) {
//     const [success, yReach] = main(vx, vy);
//     if (success) {
//       nbResults += 1;
//     }
//   }
// }

// const vy_start = -yMin - 1;
// console.log("first puzzle solution is", (vy_start * (vy_start + 1)) / 2);
// console.log("second puzzle solution is", nbResults);
