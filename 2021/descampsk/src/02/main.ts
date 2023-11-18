import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input.test`;

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const directionAndUnits = lines.map((line) => {
    const lineSplitted = line.split(" ");
    return {
      direction: lineSplitted[0],
      unit: parseInt(lineSplitted[1], 10),
    };
  });
  let finalHorizontalPosition = 0;
  let finalDepth = 0;
  directionAndUnits.forEach((directionAndUnit) => {
    const { direction, unit } = directionAndUnit;
    switch (direction) {
      case "forward":
        finalHorizontalPosition += unit;
        break;
      case "up":
        finalDepth -= unit;
        break;
      case "down":
        finalDepth += unit;
        break;
      default:
        break;
    }
  });
  return finalDepth * finalHorizontalPosition;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const directionAndUnits = lines.map((line) => {
    const lineSplitted = line.split(" ");
    return {
      direction: lineSplitted[0],
      unit: parseInt(lineSplitted[1], 10),
    };
  });
  let finalHorizontalPosition = 0;
  let finalDepth = 0;
  let aim = 0;
  directionAndUnits.forEach((directionAndUnit) => {
    const { direction, unit } = directionAndUnit;
    switch (direction) {
      case "forward":
        finalHorizontalPosition += unit;
        finalDepth += aim * unit;
        break;
      case "up":
        aim -= unit;
        break;
      case "down":
        aim += unit;
        break;
      default:
        break;
    }
  });
  return finalDepth * finalHorizontalPosition;
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
