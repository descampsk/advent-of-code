import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
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

type Node = {
  id: string;
  x: number;
  y: number;
  z: number;
  childs: Record<string, Node>;
};

const distanceSquared = (a: Node, b: Node) => {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const totalConnections = lines.length < 30 ? 10 : 1000;

  const nodes: Node[] = [];
  for (const line of lines) {
    const [x, y, z] = line.split(",").map(Number);
    nodes.push({ id: line, x, y, z, childs: {} });
  }

  const pairs: { a: Node; b: Node; distSq: number }[] = [];
  // Create all possibles pairings
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const distSq = distanceSquared(a, b);
      pairs.push({ a, b, distSq });
    }
  }

  pairs.sort((p1, p2) => p1.distSq - p2.distSq);

  console.log(pairs.slice(0, 10));

  for (let i = 0; i < totalConnections; i++) {
    const pair = pairs[i];
    pair.a.childs[pair.b.id] = pair.b;
    pair.b.childs[pair.a.id] = pair.a;
  }

  console.log(
    nodes.map((n) => ({
      id: n.id,
      childs: Object.values(n.childs).map((c) => c.id),
    })),
  );

  const circuits: Set<string>[] = [];
  for (const node of nodes) {
    const visited: Set<string> = new Set();
    const stack: Node[] = [node];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!visited.has(current.id)) {
        visited.add(current.id);
        for (const child of Object.values(current.childs)) {
          stack.push(child);
        }
      }
    }

    const foundCircuit = circuits.find((circuit) =>
      Array.from(visited).some((id) => circuit.has(id)),
    );

    if (foundCircuit) {
      console.log("Existing circuit found:", Array.from(visited), foundCircuit);
      for (const id of visited) {
        foundCircuit.add(id);
      }
    } else {
      console.log("New circuit found:", Array.from(visited));
      circuits.push(visited);
    }
    console.log(circuits);
  }

  circuits.sort((a, b) => b.size - a.size);
  console.log("Final circuits:", circuits);

  return circuits[0].size * circuits[1].size * circuits[2].size;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const nodes: Node[] = [];
  for (const line of lines) {
    const [x, y, z] = line.split(",").map(Number);
    nodes.push({ id: line, x, y, z, childs: {} });
  }

  const pairs: { a: Node; b: Node; distSq: number }[] = [];
  // Create all possibles pairings
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const distSq = distanceSquared(a, b);
      pairs.push({ a, b, distSq });
    }
  }

  pairs.sort((p1, p2) => p1.distSq - p2.distSq);

  console.log(pairs.slice(0, 10));

  const circuits: Set<string>[] = [];

  let lastPair: [Node, Node] = [];
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    pair.a.childs[pair.b.id] = pair.b;
    pair.b.childs[pair.a.id] = pair.a;

    const foundCircuit = circuits.find(
      (circuit) => circuit.has(pair.a.id) || circuit.has(pair.b.id),
    );

    if (foundCircuit) {
      foundCircuit.add(pair.a.id);
      foundCircuit.add(pair.b.id);
    } else {
      const newCircuit: Set<string> = new Set();
      newCircuit.add(pair.a.id);
      newCircuit.add(pair.b.id);
      circuits.push(newCircuit);
    }

    console.log(`After adding pair ${pair.a.id} - ${pair.b.id}:`, circuits);

    // Merge circuits if needed
    for (let j = 0; j < circuits.length; j++) {
      for (let k = j + 1; k < circuits.length; k++) {
        const circuitA = circuits[j];
        const circuitB = circuits[k];
        if (Array.from(circuitA).some((id) => circuitB.has(id))) {
          // Merge B into A
          for (const id of circuitB) {
            circuitA.add(id);
          }
          circuits.splice(k, 1);
          k--;
        }
      }
    }

    if (circuits[0].size === nodes.length) {
      lastPair = [pair.a, pair.b];
      console.log(
        `All nodes connected after adding pair ${pair.a.id} - ${pair.b.id}`,
      );
      break;
    }
  }

  console.log("lastPair", lastPair);

  return lastPair[0].x * lastPair[1].x;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
