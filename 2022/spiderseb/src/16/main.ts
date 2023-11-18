/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-use-before-define */
/* eslint-disable no-loop-func */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

class Node {
  name: string;

  flowRate: number;

  links: Node[] = [];

  distances: { node: Node; distance: number }[] = [];

  constructor(line: string) {
    const [flow] = line.split(";");
    const result = flow.match(/([A-Z]{2})[^0-9]+([0-9]+)/);
    if (!result?.[2]) {
      throw new Error(`invalid input data: ${line}`);
    }

    // eslint-disable-next-line prefer-destructuring
    this.name = result[1];
    this.flowRate = Number(result[2]);
  }

  addLinks(links: Node[], line: string) {
    const [, valves] = line.split(";");
    const linkNames = valves.match(/([A-Z]{2})/g) as string[];
    this.links = links.filter((link) => linkNames.includes(link.name));
  }

  computeDistances() {
    let currentPoints: Node[] = [this];

    let distance = 1;
    while (currentPoints.length) {
      const nextPoints: Node[] = [];
      currentPoints.forEach((node) => {
        node.links.forEach((link) => {
          const alreadyProcessed = this.distances.find(
            (distanceNode) => distanceNode.node === link
          );
          if (!alreadyProcessed && link !== this) {
            nextPoints.push(link);
            this.distances.push({ node: link, distance });
          }
        });
      });
      currentPoints = nextPoints;
      distance++;
    }
    // Keep only valuables distances
    this.distances = this.distances.filter(
      (distanceNode) => distanceNode.node.flowRate
    );
  }
}

const findPath1 = (
  startingNode: Node,
  remainingTime: number,
  unavailableNodes: Node[],
  ignoreSmallInFirst = 0
): [score: number, path: Node[]] => {
  type ProcessedNode = {
    node: Node;
    time: number;
    score: number;
    opened: Node[];
  };

  const processedNodes: ProcessedNode[] = [
    {
      node: startingNode,
      opened: [],
      time: 0,
      score: 0,
    },
  ];
  let bestScore = 0;
  let opened: Node[] = [];
  while (processedNodes[0] && processedNodes[0].time < remainingTime) {
    const currentNode = processedNodes.shift()!;

    currentNode.node.distances.forEach((distanceNode) => {
      const newTime = currentNode.time + distanceNode.distance + 1;
      if (newTime >= remainingTime) return; // Too late
      if (unavailableNodes.includes(distanceNode.node)) return; // unavailable nodes
      if (currentNode.opened.includes(distanceNode.node)) return; // Already processed
      if (
        distanceNode.node.flowRate < 10 &&
        currentNode.opened.length < ignoreSmallInFirst
      )
        return;
      // TODO trouver des nodes useless car permettront pas d'atteindre le top score
      const newScore =
        currentNode.score +
        (remainingTime - newTime) * distanceNode.node.flowRate;
      processedNodes.push({
        node: distanceNode.node,
        time: newTime,
        score: newScore,
        opened: [...currentNode.opened, distanceNode.node],
      });
      if (newScore > bestScore) {
        bestScore = newScore;
        opened = [...currentNode.opened, distanceNode.node];
      }
    });

    processedNodes.sort((a, b) => a.time - b.time);
  }
  return [bestScore, opened];
};
const resolveFirstPuzzle = async (
  inputPath: string,
  ignoreSmallInFirst = 0
) => {
  const lines = await readInputs<string>(inputPath);
  const nodes: Node[] = lines.map((line) => new Node(line));
  lines.forEach((line, index) => {
    nodes[index].addLinks(nodes, line);
  });
  nodes.forEach((node) => node.computeDistances());

  return findPath1(
    nodes.find((node) => node.name === "AA")!,
    30,
    [],
    ignoreSmallInFirst
  );
};

const findPath2 = (
  startingNode: Node,
  remainingTime: number,
  unavailableNodes: Node[],
  startingHumanNode?: Node,
  ignoreSmallInFirst = 0
): number => {
  type ProcessedNode = {
    nodeH: Node;
    nodeE: Node;
    timeH: number;
    timeE: number;
    score: number;
    opened: Set<Node>;
  };
  // To speedup process, use 1st node of the 1st part as first humain node
  const startHumanTime = startingHumanNode
    ? (startingNode.distances.find(
        (distanceNode) => distanceNode.node === startingHumanNode
      )?.distance || 0) + 1
    : 0;

  const processedNodes: ProcessedNode[] = [
    {
      nodeH: startingHumanNode || startingNode,
      nodeE: startingNode,
      opened: new Set(startingHumanNode ? [startingHumanNode] : []),
      timeH: startHumanTime,
      timeE: 0,
      score: startingHumanNode
        ? startingHumanNode.flowRate * (remainingTime - startHumanTime)
        : 0,
    },
  ];
  let bestScore = 0;
  let opened: Node[] = [];
  let count = 0;

  // Keep hash key of path to avoid duplicates or less interresting path
  // Make code a little more tricky, but speed up by 100 times
  const histo = new Map<
    string,
    Array<{ score: number; time1: number; time2: number }>
  >();

  while (
    processedNodes[0] &&
    (processedNodes[0].timeH < remainingTime ||
      processedNodes[0].timeE < remainingTime)
  ) {
    const currentNode = processedNodes.shift()!;

    const user = currentNode.timeH > currentNode.timeE ? "E" : "H";
    const other = currentNode.timeH > currentNode.timeE ? "H" : "E";
    count++;
    if (count % 1000 === 0) {
      // Do not log too much, it can be slow the process by 20%...
      console.log(currentNode[`time${user}`], processedNodes.length);
      count = 0;
    }

    let added = false;
    currentNode[`node${user}`].distances.forEach((distanceNode) => {
      const newTime = currentNode[`time${user}`] + distanceNode.distance + 1;
      if (newTime >= remainingTime) return; // Too late
      if (unavailableNodes.includes(distanceNode.node)) return; // unavailable nodes
      if (currentNode.opened.has(distanceNode.node)) return; // Already processed
      if (
        distanceNode.node.flowRate < 10 &&
        currentNode.opened.size < ignoreSmallInFirst
      )
        return; // Probably better to do during first steps than open slowpoints

      const newScore =
        currentNode.score +
        (remainingTime - newTime) * distanceNode.node.flowRate;

      const processingNode = {
        ...currentNode,
        score: newScore,
        opened: new Set([...currentNode.opened, distanceNode.node]),
      };
      processingNode[`node${user}`] = distanceNode.node;
      processingNode[`time${user}`] = newTime;

      // search in histo if better score/time with same current H/E position and same opened
      const nodeNames = [
        processingNode[`node${user}`].name,
        processingNode[`node${other}`].name,
      ]
        .sort()
        .join("");

      const histoKey = `${[...processingNode.opened]
        .map((node) => node.name)
        .sort()
        .join("")}-${nodeNames}`;
      const [time1, time2] =
        nodeNames.substring(0, 2) === processingNode[`node${user}`].name
          ? [processingNode[`time${user}`], processingNode[`time${other}`]]
          : [processingNode[`time${other}`], processingNode[`time${user}`]];
      const histoValues = histo.get(histoKey);
      if (histoValues) {
        for (const histoValue of histoValues) {
          if (
            histoValue.score >= newScore &&
            histoValue.time1 <= time1 &&
            histoValue.time2 <= time2
          ) {
            return;
          }
        }
        histoValues.push({ score: newScore, time1, time2 });
      } else {
        histo.set(histoKey, [{ score: newScore, time1, time2 }]);
      }

      processedNodes.push(processingNode);
      added = true;
      if (newScore > bestScore) {
        bestScore = newScore;
        opened = [...processingNode.opened];
      }
    });
    if (!added) {
      if (currentNode[`time${other}`] < remainingTime) {
        const processingNode = { ...currentNode };
        processingNode[`time${user}`] = remainingTime;
        processedNodes.push(processingNode);
      }
    }
  }
  console.log(
    "finaly opened",
    opened.map((node) => node.name)
  );
  return bestScore;
};

const resolveSecondPuzzle = async (
  inputPath: string,
  ignoreSmallInFirst = 0,
  startNode = ""
) => {
  const lines = await readInputs<string>(inputPath);
  const nodes: Node[] = lines.map((line) => new Node(line));
  lines.forEach((line, index) => {
    nodes[index].addLinks(nodes, line);
  });
  nodes.forEach((node) => node.computeDistances());

  const score = findPath2(
    nodes.find((node) => node.name === "AA")!,
    26,
    [],
    startNode ? nodes.find((node) => node.name === startNode) : undefined,
    ignoreSmallInFirst
  );

  return score;
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH, 4);
  console.log("##  TEST 1  ##", result1Test[0]); // 1651
  console.log(result1Test[1].map((node) => node.name)); // Put first value to part 2 to speed up
  // [ 'DD', 'BB', 'JJ', 'HH', 'EE', 'CC' ]
  const result1 = await resolveFirstPuzzle(INPUT_PATH, 9);
  console.log("## RESULT 1 ##", result1[0]); // 2253
  console.log(result1[1].map((node) => node.name)); // Put first value to part 2 to speed up
  // ['KQ', 'RF', 'AZ','VI', 'IM', 'IY','AQ', 'HA']

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH, 4, "DD");
  console.log("##  TEST 2  ##", result2Test); // 1707
  const result2 = await resolveSecondPuzzle(INPUT_PATH, 3, "KQ"); // "KQ"
  console.log("## RESULT 2 ##", result2); // 2838. run in 347s
};

main().catch((error) => console.error(error));
