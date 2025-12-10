import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, { min } from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const parseFile = (filename: string) =>
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), filename).replace(
      /\/dist\//g,
      "/src/",
    ),
    "utf-8",
  );

const inputTest = parseFile("input.test.txt");

type Point = { x: number; y: number };

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const redTiles: { x: number; y: number }[] = lines.map((line) => {
    const [xStr, yStr] = line.split(",");
    return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
  });

  // const maxX = Math.max(...redTiles.map(({ x }) => x));
  // const maxY = Math.max(...redTiles.map(({ y }) => y));

  // const matrix: string[][] = Array.from({ length: maxY + 2 }, () =>
  //   Array.from({ length: maxX + 2 }, () => "."),
  // );

  // for (const { x, y } of redTiles) {
  //   matrix[y][x] = "#";
  // }

  // console.log(matrix.map((row) => row.join("")).join("\n"));

  const pairs: [Point, Point][] = [];
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      pairs.push([redTiles[i], redTiles[j]]);
    }
  }

  console.log(pairs);

  let maxArea = 0;
  for (const [p1, p2] of pairs) {
    const area = Math.abs(p1.x - p2.x + 1) * Math.abs(p1.y - p2.y + 1);
    if (area > maxArea) {
      maxArea = area;
    }
  }

  console.log("Max Area:", maxArea);

  return maxArea;
};

const isPointInside = (point: Point, polygone: Point[]) => {
  let inside = false;
  const n = polygone.length;
  let p1X = polygone[n - 1].x;
  let p1Y = polygone[n - 1].y;

  const { x, y } = point;

  for (let i = 0; i < n; i++) {
    const p2X = polygone[i].x;
    const p2Y = polygone[i].y;

    if (
      p1X === p2X &&
      x === p1X &&
      Math.min(p1Y, p2Y) <= y &&
      y <= Math.max(p1Y, p2Y)
    ) {
      // Le point est sur une ligne verticale du polygone
      return true;
    }

    if (
      p1Y === p2Y &&
      y === p1Y &&
      Math.min(p1X, p2X) <= x &&
      x <= Math.max(p1X, p2X)
    ) {
      // Le point est sur une ligne horizontale du polygone
      return true;
    }

    if (
      ((p1Y <= y && y < p2Y) || (p2Y <= y && y < p1Y)) &&
      x < ((p2X - p1X) * (y - p1Y)) / (p2Y - p1Y) + p1X
    ) {
      inside = !inside;
    }

    p1X = p2X;
    p1Y = p2Y;
  }

  return inside;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const polygone: Point[] = lines.map((line) => {
    const [xStr, yStr] = line.split(",");
    return { x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
  });

  // On construit tout les rectangles possibles à partir des points
  let rectangles: [Point, Point][] = [];
  for (let i = 0; i < polygone.length; i++) {
    for (let j = i + 1; j < polygone.length; j++) {
      const p1 = polygone[i];
      const p2 = polygone[j];
      rectangles.push([p1, p2]);
    }
  }

  rectangles = rectangles.filter((rect) => {
    const area =
      Math.abs(rect[0].x - rect[1].x + 1) * Math.abs(rect[0].y - rect[1].y + 1);
    return area > 1778455;
  });

  rectangles.sort((a, b) => {
    const areaA = Math.abs(a[0].x - a[1].x + 1) * Math.abs(a[0].y - a[1].y + 1);
    const areaB = Math.abs(b[0].x - b[1].x + 1) * Math.abs(b[0].y - b[1].y + 1);
    return areaA - areaB; // Tri décroissant par aire
  });

  console.log("Rectangles sorted");

  const isInsidePoints = new Map<string, boolean>();

  let maxArea = 0;

  // Pour tout les rectangles, on vérifie si tout les points du rectangle sont à l'intérieur du polygone
  for (const [p1, p2] of rectangles) {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    let isRectangleInside = true;

    // console.log("Checking rectangle from", p1, "to", p2);

    // On vérifie que 1 points sur 10
    for (let x = minX; x <= maxX; x += 1000) {
      for (let y = minY; y <= maxY; y += 1000) {
        const pointKey = `${x},${y}`;
        let isInside = isInsidePoints.get(pointKey);

        if (isInside === undefined) {
          const point: Point = { x, y };
          isInside = isPointInside(point, polygone);
          isInsidePoints.set(pointKey, isInside);
        }

        if (!isInside) {
          isRectangleInside = false;
          break;
        }
      }
      if (!isRectangleInside) {
        break;
      }
    }

    // console.log(
    //   `Rectangle from (${minX}, ${minY}) to (${maxX}, ${maxY}) is inside: ${isRectangleInside}`,
    // );

    if (isRectangleInside) {
      const area = (maxX - minX + 1) * (maxY - minY + 1);
      if (area > maxArea) {
        maxArea = area;
        console.log(
          `New max area found: ${maxArea} for rectangle from (${minX}, ${minY}) to (${maxX}, ${maxY})`,
        );
        // break; // On peut arrêter dès qu'on trouve le premier rectangle valide
      }
    }
  }

  return maxArea;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 24,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
