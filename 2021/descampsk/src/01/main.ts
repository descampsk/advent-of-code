import { readInputs } from "../helpers/read-inputs";

const isIncreased = (previous: number, next: number) => previous < next;

const resolveFirstPuzzle = async () => {
  const lines = await readInputs("./src/01/input.txt");
  let increased = 0;
  if (lines.length > 1) {
    for (let i = 1; i < lines.length; i += 1) {
      if (isIncreased(parseInt(lines[i - 1], 10), parseInt(lines[i], 10))) {
        increased += 1;
      }
    }
  }
  console.log(increased);
};

const resolveSecondPuzzle = async () => {
  const linesString = await readInputs("./src//01/input.txt");
  const lines = linesString.map((lineString) => parseInt(lineString, 10));
  let increased = 0;
  if (lines.length > 1) {
    for (let i = 3; i < lines.length; i += 1) {
      const firstSum = lines[i - 3] + lines[i - 2] + lines[i - 1];
      const secondSum = lines[i - 2] + lines[i - 1] + lines[i];
      if (isIncreased(firstSum, secondSum)) {
        increased += 1;
      }
    }
  }
  console.log(increased);
};

const main = async () => {
  await resolveFirstPuzzle();
  await resolveSecondPuzzle();
};

main().catch((error) => {
  console.error(error);
});
