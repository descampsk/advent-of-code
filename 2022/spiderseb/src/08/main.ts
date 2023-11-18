import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const isGreater = (tree: number, trees: string): boolean => {
  return (
    undefined ===
    trees
      .split("")
      .map(Number)
      .find((otherTree) => otherTree >= tree)
  );
};

const isTreeVisible = (
  trees: string[],
  lineIndex: number,
  columnIndex: number
): boolean => {
  const tree = Number(trees[lineIndex][columnIndex]);

  // Left visible ?
  if (isGreater(tree, trees[lineIndex].substring(0, columnIndex))) return true;

  // Right visible ?
  if (
    isGreater(
      tree,
      trees[lineIndex].substring(columnIndex + 1, trees[lineIndex].length)
    )
  )
    return true;

  // top
  const topTrees = trees.reduce((acc, current, currentIndex) => {
    if (currentIndex < lineIndex) return acc + current[columnIndex];
    return acc;
  }, "");
  if (isGreater(tree, topTrees)) return true;

  // bottom
  const bottomTrees = trees.reduce((acc, current, currentIndex) => {
    if (currentIndex > lineIndex) return acc + current[columnIndex];
    return acc;
  }, "");
  if (isGreater(tree, bottomTrees)) return true;

  return false;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);

  let visibleTrees = lines.length * 2 + lines[0].length * 2 - 4;
  for (let lineIndex = 1; lineIndex < lines.length - 1; lineIndex++) {
    for (
      let treeIndex = 1;
      treeIndex < lines[lineIndex].length - 1;
      treeIndex++
    ) {
      if (isTreeVisible(lines, lineIndex, treeIndex)) visibleTrees++;
    }
  }

  return visibleTrees;
};

const countVisibleTrees = (tree: number, trees: string): number => {
  for (let i = 0; i < trees.length; i++)
    if (Number(trees[i]) >= tree) return i + 1;
  return trees.length;
};

const calcScore = (
  trees: string[],
  lineIndex: number,
  columnIndex: number
): number => {
  const tree = Number(trees[lineIndex][columnIndex]);

  // Left
  const scoreLeft = countVisibleTrees(
    tree,
    trees[lineIndex].substring(0, columnIndex).split("").reverse().join("")
  );

  // Right
  const scoreRight = countVisibleTrees(
    tree,
    trees[lineIndex].substring(columnIndex + 1, trees[lineIndex].length)
  );

  // top
  const topTrees = trees.reduce((acc, current, currentIndex) => {
    if (currentIndex < lineIndex) return acc + current[columnIndex];
    return acc;
  }, "");
  const scoreTop = countVisibleTrees(
    tree,
    topTrees.split("").reverse().join("")
  );

  // bottom
  const bottomTrees = trees.reduce((acc, current, currentIndex) => {
    if (currentIndex > lineIndex) return acc + current[columnIndex];
    return acc;
  }, "");
  const scoreBottom = countVisibleTrees(tree, bottomTrees);

  return scoreLeft * scoreRight * scoreTop * scoreBottom;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs<string>(inputPath);

  let maxScore = 0;
  for (let lineIndex = 1; lineIndex < lines.length - 1; lineIndex++) {
    for (
      let treeIndex = 1;
      treeIndex < lines[lineIndex].length - 1;
      treeIndex++
    ) {
      const score = calcScore(lines, lineIndex, treeIndex);
      if (score > maxScore) maxScore = score;
    }
  }

  return maxScore;
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
