import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const polymer = lines[0];
  const rules: Record<string, string> = {};
  lines.pop();
  for (let i = 2; i < lines.length; i++) {
    const [pair, element] = lines[i].split(" -> ");
    rules[pair] = element;
  }
  return {
    polymer,
    rules,
  };
};

const resolveWithFirstMethod = (
  polymer: string,
  rules: Record<string, string>,
  maxStep: number
) => {
  console.time("resolveWithFirstMethod");
  let newPolymer = polymer;

  for (let i = 0; i < maxStep; i++) {
    let polymerWithInsertion = "";
    for (let j = 0; j < newPolymer.length - 1; j++) {
      const pair = newPolymer.charAt(j) + newPolymer.charAt(j + 1);
      if (rules[pair]) {
        polymerWithInsertion += newPolymer.charAt(j) + rules[pair];
      } else {
        polymerWithInsertion += newPolymer.charAt(j);
      }
    }
    polymerWithInsertion += newPolymer.charAt(newPolymer.length - 1);
    newPolymer = polymerWithInsertion;
  }

  const elements: Record<string, number> = {};
  for (let i = 0; i < newPolymer.length; i++) {
    const char = newPolymer.charAt(i);
    if (elements[char]) {
      elements[char] += 1;
    } else {
      elements[char] = 1;
    }
  }
  if (elements && Object.entries(elements).length) {
    const sortedElements = Object.entries(elements).sort((a, b) => a[1] - b[1]);
    console.timeEnd("resolveWithFirstMethod");
    return sortedElements[sortedElements.length - 1][1] - sortedElements[0][1];
  }

  console.timeEnd("resolveWithFirstMethod");
  return 0;
};

const resolveWithBetterMethod = (
  polymer: string,
  rules: Record<string, string>,
  maxStep: number
) => {
  console.time("resolveWithBetterMethod");
  const pairRules: Record<string, string[]> = {};
  Object.keys(rules).forEach((key) => {
    const value = rules[key];
    pairRules[key] = [key.charAt(0) + value, value + key.charAt(1)];
  });
  let pairPolymers: string[] = [];
  for (let i = 0; i < polymer.length - 1; i++) {
    pairPolymers.push(polymer.charAt(i) + polymer.charAt(i + 1));
  }

  for (let i = 0; i < maxStep; i++) {
    const newPairPolymers = [];
    for (let j = 0; j < pairPolymers.length; j++) {
      const pairPolymer = pairPolymers[j];
      const pairRule = pairRules[pairPolymer];
      if (pairRule) {
        newPairPolymers.push(...pairRule);
      } else {
        throw new Error(`${pairPolymer} has no rules`);
      }
    }
    pairPolymers = [...newPairPolymers];
  }

  const elements: Record<string, number> = {};
  for (let i = 1; i < pairPolymers.length - 1; i++) {
    for (let j = 0; j < pairPolymers[i].length; j++) {
      const char = pairPolymers[i][j];
      if (elements[char]) {
        elements[char] += 1;
      } else {
        elements[char] = 1;
      }
    }
  }
  elements[pairPolymers[0].charAt(0)] += 2;
  elements[pairPolymers[0].charAt(1)] += 1;
  elements[pairPolymers[pairPolymers.length - 1].charAt(0)] += 1;
  elements[pairPolymers[pairPolymers.length - 1].charAt(1)] += 2;
  if (elements && Object.entries(elements).length) {
    const sortedElements = Object.entries(elements).sort((a, b) => a[1] - b[1]);
    console.timeEnd("resolveWithBetterMethod");
    return (
      (sortedElements[sortedElements.length - 1][1] - sortedElements[0][1]) / 2
    );
  }

  console.timeEnd("resolveWithBetterMethod");
  return 0;
};

const resolveWithBestMethod = (
  polymer: string,
  rules: Record<string, string>,
  maxStep: number
) => {
  console.time("resolveWithBestMethod");
  const pairRules: Record<string, string[]> = {};
  Object.keys(rules).forEach((key) => {
    const value = rules[key];
    pairRules[key] = [key.charAt(0) + value, value + key.charAt(1)];
  });
  let pairPolymers: Record<string, number> = {};
  for (let i = 0; i < polymer.length - 1; i++) {
    const pair = polymer.charAt(i) + polymer.charAt(i + 1);
    if (pairPolymers[pair]) {
      pairPolymers[pair] += 1;
    } else {
      pairPolymers[pair] = 1;
    }
  }

  for (let i = 0; i < maxStep; i++) {
    const newPairPolymers: Record<string, number> = {};
    const pairs = Object.keys(pairPolymers);
    for (let j = 0; j < pairs.length; j++) {
      const pairPolymer = pairs[j];
      const pairRule = pairRules[pairPolymer];
      if (pairRule) {
        for (let k = 0; k < pairRule.length; k++) {
          if (newPairPolymers[pairRule[k]]) {
            newPairPolymers[pairRule[k]] += pairPolymers[pairPolymer];
          } else {
            newPairPolymers[pairRule[k]] = pairPolymers[pairPolymer];
          }
        }
      } else {
        throw new Error(`${pairPolymer} has no rules`);
      }
    }
    pairPolymers = { ...newPairPolymers };
  }

  const elements: Record<string, number> = {};
  Object.entries(pairPolymers).forEach(([pair, number]) => {
    const firstChar = pair.charAt(0);
    const secondChar = pair.charAt(1);
    if (elements[firstChar]) {
      elements[firstChar] += number;
    } else {
      elements[firstChar] = number;
    }
    if (elements[secondChar]) {
      elements[secondChar] += number;
    } else {
      elements[secondChar] = number;
    }
  });
  elements[polymer.charAt(0)] += 1;
  elements[polymer.charAt(polymer.length - 1)] += 1;
  if (elements && Object.entries(elements).length) {
    const sortedElements = Object.entries(elements).sort((a, b) => a[1] - b[1]);
    console.timeEnd("resolveWithBestMethod");
    return (
      (sortedElements[sortedElements.length - 1][1] - sortedElements[0][1]) / 2
    );
  }

  console.timeEnd("resolveWithBestMethod");
  return 0;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const { polymer, rules } = await decodeInput(inputPath);
  const resultFirstMethod = resolveWithFirstMethod(polymer, rules, 10);
  const resultBetterMethod = resolveWithBetterMethod(polymer, rules, 10);
  const resultBestMethod = resolveWithBestMethod(polymer, rules, 10);

  if (
    resultBetterMethod !== resultFirstMethod ||
    resultBetterMethod !== resultBestMethod
  ) {
    throw new Error(
      `${resultBetterMethod} !== ${resultFirstMethod} !== ${resultBestMethod}`
    );
  }

  return resultFirstMethod;
};

const resolveFirstAndHalfPuzzle = async (inputPath: string) => {
  const { polymer, rules } = await decodeInput(inputPath);
  const resultFirstMethod = resolveWithFirstMethod(polymer, rules, 20);
  const resultBetterMethod = resolveWithBetterMethod(polymer, rules, 20);
  const resultBestMethod = resolveWithBestMethod(polymer, rules, 20);

  if (
    resultBetterMethod !== resultFirstMethod ||
    resultBetterMethod !== resultBestMethod
  ) {
    throw new Error(
      `${resultBetterMethod} !== ${resultFirstMethod} !== ${resultBestMethod}`
    );
  }

  return resultFirstMethod;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const { polymer, rules } = await decodeInput(inputPath);
  const resultBestMethod = resolveWithBestMethod(polymer, rules, 40);
  return resultBestMethod;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  const resultFirstAndHalfPuzzleTest = await resolveFirstAndHalfPuzzle(
    TEST_INPUT_PATH
  );
  console.log(
    "The result of the first and half puzzle test is:",
    resultFirstAndHalfPuzzleTest
  );
  const resultFirstAndHalfPuzzle = await resolveFirstAndHalfPuzzle(INPUT_PATH);
  console.log(
    "The result of the first and half puzzle is: ",
    resultFirstAndHalfPuzzle
  );

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
