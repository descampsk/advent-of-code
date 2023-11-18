import { readInputs } from "../helpers/read-inputs";

export const LETTERS = {
  0: ["a", "b", "c", "e", "f", "g"],
  1: ["c", "f"],
  2: ["a", "c", "d", "e", "g"],
  3: ["a", "c", "d", "f", "g"],
  4: ["b", "c", "d", "f"],
  5: ["a", "b", "d", "f", "g"],
  6: ["a", "b", "d", "e", "f", "g"],
  7: ["a", "c", "f"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "c", "d", "f", "g"],
} as Record<number, string[]>;

export const ALL_CHAR_POSSIBLES = ["a", "b", "c", "d", "e", "f", "g"];

export const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  const entriesAndOutputs = lines.map((line) => {
    const [fullEntries, fullOutputs] = line.split("|");
    const entries = fullEntries
      .split(" ")
      .filter((entry) => entry && entry !== " ");
    const outputs = fullOutputs
      .split(" ")
      .filter((output) => output && output !== " ");
    return {
      entries,
      outputs,
    };
  });
  return entriesAndOutputs;
};

const countLetters = (segment: string) => {
  const letterCount: Record<string, number> = {};
  for (let i = 0; i < segment.length; i += 1) {
    const char = segment.charAt(i);
    if (letterCount[char]) {
      letterCount[char] += 1;
    } else {
      letterCount[char] = 1;
    }
  }
  return letterCount;
};

export const checkUniqueCombination = (segment: string) => {
  const letterCount = countLetters(segment);
  switch (Object.keys(letterCount).length) {
    case 2:
      return 1;
    case 3:
      return 7;
    case 4:
      return 4;
    case 7:
      return 8;
    default:
      return null;
  }
};

export const initializeSolution = () => {
  return {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  } as Record<number, string[]>;
};

export const isSolutionLettersValide = (
  solutionLetters: Record<string, string>,
  inputs: string[]
) => {
  const solution = initializeSolution();
  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];
    const transformed = [...input]
      .map((char) => {
        return solutionLetters[char];
      })
      .sort();
    for (let j = 0; j < 10; j += 1) {
      const value = LETTERS[j];
      if (transformed.toString() === value.toString()) {
        solution[j].push(input);
        if (solution[j].length > 1) {
          return { isValid: false, solution };
        }
      }
    }
  }
  for (let j = 0; j < 10; j += 1) {
    if (solution[j].length === 0) {
      return { isValid: false, solution };
    }
  }
  return { isValid: true, solution };
};

export const findSolution = (
  possibleSolutions: string[],
  entries: string[]
) => {
  for (let i = 0; i < possibleSolutions.length; i += 1) {
    const solution = possibleSolutions[i];
    const solutionLetters = {
      a: solution.charAt(0),
      b: solution.charAt(1),
      c: solution.charAt(2),
      d: solution.charAt(3),
      e: solution.charAt(4),
      f: solution.charAt(5),
      g: solution.charAt(6),
    };
    const isValidSolution = isSolutionLettersValide(solutionLetters, entries);
    if (isValidSolution.isValid) {
      return isValidSolution.solution;
    }
  }

  return null;
};
