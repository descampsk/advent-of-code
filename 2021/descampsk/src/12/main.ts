import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  const tree: Record<string, string[]> = {};
  lines.forEach((line) => {
    const [from, to] = line.split("-");
    if (!tree[to]) {
      tree[to] = [];
    }
    if (!tree[from]) {
      tree[from] = [];
    }
    if (to !== "start") {
      tree[from].push(to);
    }
    if (from !== "start") {
      tree[to].push(from);
    }
    delete tree.end;
  });
  return tree;
};

const validatePathFirstPuzzle = (fullPath: string[]) => {
  const visited: Record<string, boolean> = {};
  for (let i = 0; i < fullPath.length; i++) {
    const cave = fullPath[i];
    if (!visited[cave]) {
      visited[cave] = true;
    } else if (cave.toLowerCase() === cave) {
      return false;
    }
  }
  return true;
};

const validatePathSecondPuzzle = (fullPath: string[]) => {
  const visited: Record<string, number> = {};
  for (let i = 0; i < fullPath.length; i++) {
    const cave = fullPath[i];
    if (cave !== "start" && cave !== "end" && cave.toLowerCase() === cave) {
      if (!visited[cave]) {
        visited[cave] = 1;
      } else {
        const keys = Object.keys(visited);
        for (let j = 0; j < keys.length; j++) {
          if (visited[keys[j]] > 1) {
            return false;
          }
        }
        visited[cave] = 2;
      }
    }
  }
  return true;
};

const findPath = (
  fullPath: string[],
  tree: Record<string, string[]>,
  validatePath: (pathToValidate: string[]) => boolean
): string[][] => {
  const from = fullPath[fullPath.length - 1];
  const tos = tree[from];
  if (!tos || !tos.length) {
    return [fullPath];
  }
  const nextFullPaths: string[][] = [];
  for (let i = 0; i < tos.length; i++) {
    const to = tos[i];
    const nextFullPath = [...fullPath, to];
    if (validatePath(nextFullPath)) {
      if (to === "end") {
        nextFullPaths.push(nextFullPath);
      } else {
        nextFullPaths.push(...findPath(nextFullPath, tree, validatePath));
      }
    }
  }
  return nextFullPaths;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const tree = await decodeInput(inputPath);
  const paths = findPath(["start"], tree, validatePathFirstPuzzle);
  return paths.length;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const tree = await decodeInput(inputPath);
  const paths = findPath(["start"], tree, validatePathSecondPuzzle);
  return paths.length;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  const resultSecondPuzzleTest = await resolveSecondPuzzle(TEST_INPUT_PATH);
  console.log(
    "The result of the second puzzle test is:",
    resultSecondPuzzleTest
  );
  const resultSecondPuzzle = await resolveSecondPuzzle(INPUT_PATH);
  console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
