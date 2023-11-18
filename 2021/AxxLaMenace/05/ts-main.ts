import { readFile } from "fs/promises";

function createPoints(line: string) {
  const [point1, point2] = line.split(" -> ");
  const [xA, yA] = point1.split(",").map((item) => parseInt(item, 10));
  const [xB, yB] = point2.split(",").map((item) => parseInt(item, 10));
  return [xA, yA, xB, yB];
}

function computeSegment(points: number[], considerDiagonals: Boolean = false) {
  const [xA, yA, xB, yB] = points;
  const [xMin, xMax] = [Math.min(xA, xB), Math.max(xA, xB)];
  const [yMin, yMax] = [Math.min(yA, yB), Math.max(yA, yB)];
  let segmentPoints = [];
  if (xA == xB) {
    for (let y = yMin; y <= yMax; y++) {
      segmentPoints.push(`${xA},${y}`);
    }
  } else if (yA == yB) {
    for (let x = xMin; x <= xMax; x++) {
      segmentPoints.push(`${x},${yA}`);
    }
  } else if (considerDiagonals && yMax - yMin == xMax - xMin) {
    for (let i = 0; i <= xMax - xMin; i++) {
      const gradX = (xB - xA) / Math.abs(xB - xA);
      const gradY = (yB - yA) / Math.abs(yB - yA);
      segmentPoints.push(`${xA + i * gradX},${yA + i * gradY}`);
    }
  }
  return segmentPoints;
}

function solvePuzzle(lines: string[], considerDiagonals: Boolean = false) {
  const countDict: Record<string, number> = {};
  lines.forEach((line) => {
    const segmentPoints = computeSegment(createPoints(line), considerDiagonals);
    segmentPoints.forEach((point) => {
      countDict[point] = point in countDict ? countDict[point] + 1 : 1;
    });
  });
  return Object.values(countDict).reduce((a, b) => (b >= 2 ? a + 1 : a), 0);
}

async function main() {
  const file = await readFile("./05/data.txt", "utf-8");
  const lines = file.split(/\n/);
  console.log("result first puzzle:", solvePuzzle(lines, false));
  console.log("result second puzzle:", solvePuzzle(lines, true));
}

main();
