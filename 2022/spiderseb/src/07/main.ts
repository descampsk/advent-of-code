import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const buildTreeSize = (lines: string[]) => {
  const fullPath = [""];
  const tree: Record<string, number> = { "": 0 };
  lines.forEach((line) => {
    if (line[0] === "$") {
      // Command
      const [, command, dest] = line.split(" ");
      if (command === "cd") {
        if (dest === "/") {
          fullPath.splice(1, fullPath.length);
        } else if (dest === "..") {
          fullPath.pop();
        } else {
          fullPath.push(dest);
        }
      }
    } else {
      // File list
      const currentPath = fullPath.join("/");
      if (!tree[currentPath]) tree[currentPath] = 0;
      const [info] = line.split(" ");
      if (/^[0-9]+$/.test(info)) {
        const dirSize = Number(info);
        // Add size in directory and all his parents
        for (let i = 0; i < fullPath.length; i++)
          tree[fullPath.slice(0, i + 1).join("/")] += dirSize;
      }
    }
  });
  return tree;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const tree = buildTreeSize(lines);

  return Object.values(tree)
    .filter((val) => val <= 100000)
    .reduce((acc, current) => acc + current, 0);
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);
  const tree = buildTreeSize(lines);

  const freeSpace = 70000000 - tree[""];
  const neededSize = 30000000 - freeSpace;
  const sortedElligibleDirs = Object.values(tree)
    .filter((size) => size >= neededSize)
    .sort((a, b) => a - b);

  return sortedElligibleDirs[0];
};

const main = async () => {
  const result1Test = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolveFirstPuzzle(INPUT_PATH);
  console.log("## RESULT 1 ##", result1);

  const result2Test = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolveSecondPuzzle(INPUT_PATH);
  console.log("## RESULT 2 ##", result2);
};

main().catch((error) => console.error(error));
