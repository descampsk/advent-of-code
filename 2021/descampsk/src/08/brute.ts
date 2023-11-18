import { ALL_CHAR_POSSIBLES, decodeInput, findSolution } from "./common";

// eslint-disable-next-line import/prefer-default-export
export function createPossiblesSolutions(
  initialChain: string,
  charPossibles: string[]
): string[] {
  if (!charPossibles.length) {
    return [initialChain];
  }
  const solutions: string[] = [];
  for (let i = 0; i < charPossibles.length; i += 1) {
    const chain = `${initialChain}${charPossibles[i]}`;
    const nextCharPossibles = [...charPossibles];
    nextCharPossibles.splice(i, 1);
    const newSolutions = createPossiblesSolutions(chain, nextCharPossibles);
    solutions.push(...newSolutions);
  }
  return solutions;
}

export const resolveSecondPuzzleWithBruteForce = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  let sumOutputs = 0;
  const possibleSolutions = createPossiblesSolutions("", ALL_CHAR_POSSIBLES);

  decodedInputs.forEach(({ entries, outputs }) => {
    const validSolution = findSolution(possibleSolutions, entries);
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
