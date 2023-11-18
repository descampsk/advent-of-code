import {
  ALL_CHAR_POSSIBLES,
  checkUniqueCombination,
  decodeInput,
  findSolution,
} from "./common";

export const reducePossibleLetterSolutions = (entries: string[]) => {
  const solutionLetters = {} as Record<string, string[]>;
  const solutionNumbers = {} as Record<number, string[]>;
  entries.forEach((entry) => {
    const uniqueCombination = checkUniqueCombination(entry);
    if (uniqueCombination) {
      solutionNumbers[uniqueCombination] = [...entry];
    }
  });

  // We have found 1, 4, 7 and 8
  if (
    !solutionNumbers["1"] ||
    !solutionNumbers["4"] ||
    !solutionNumbers["7"] ||
    !solutionNumbers["8"]
  ) {
    throw new Error("something wrong happends");
  }

  // 1 allows us to have [c,f]
  solutionNumbers["1"].forEach((character) => {
    solutionLetters[character] = ["c", "f"];
  });

  // 7 allows us to have [a]
  solutionNumbers["7"]
    .filter((character) => !solutionNumbers["1"].includes(character))
    .forEach((character) => {
      solutionLetters[character] = ["a"];
    });

  // Solution 4 allows us to have [b, d]
  solutionNumbers["4"]
    .filter((character) => !solutionNumbers["1"].includes(character))
    .forEach((character) => {
      solutionLetters[character] = ["b", "d"];
    });

  // Solution 8 allows us to have [e, g]
  solutionNumbers["8"]
    .filter(
      (character) =>
        !solutionNumbers["4"].includes(character) &&
        !solutionNumbers["7"].includes(character)
    )
    .forEach((character) => {
      solutionLetters[character] = ["e", "g"];
    });

  return solutionLetters;
};

export function createSmartPossiblesSolutions(
  initialChain: string,
  charToAdd: string[],
  valuePerChar: Record<string, string[]>
): string[] {
  if (!charToAdd.length) {
    return [initialChain];
  }
  const solutions: string[] = [];
  const charPossibles = valuePerChar[charToAdd[0]];
  for (let i = 0; i < charPossibles.length; i += 1) {
    const chain = `${initialChain}${charPossibles[i]}`;
    const nextCharToAdd = [...charToAdd];
    nextCharToAdd.shift();
    const newSolutions = createSmartPossiblesSolutions(
      chain,
      nextCharToAdd,
      valuePerChar
    );
    solutions.push(...newSolutions);
  }
  return solutions;
}

export const resolveSecondPuzzleSmart = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  let sumOutputs = 0;
  decodedInputs.forEach(({ entries, outputs }) => {
    const possibleLettersSolutions = reducePossibleLetterSolutions(entries);
    const smartPossibleSolution = createSmartPossiblesSolutions(
      "",
      ALL_CHAR_POSSIBLES,
      possibleLettersSolutions
    );

    const validSolution = findSolution(smartPossibleSolution, entries);
    if (!validSolution) {
      throw new Error("No solution has been found");
    }

    let outputValue = "";
    outputs.forEach((output) => {
      Object.keys(validSolution).forEach((key) => {
        const chain = validSolution[parseInt(key, 10)][0];
        const sortedChain = [...chain].sort().toString();
        const sortedOutput = [...output].sort().toString();
        if (sortedChain === sortedOutput) {
          outputValue += key;
        }
      });
    });

    sumOutputs += parseInt(outputValue, 10);
  });

  return sumOutputs;
};
