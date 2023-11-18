import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const decodeInput = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  lines.pop();
  return lines.map((line) => {
    const [onOff, coordinates] = line.split(" ");
    const [x, y, z] = coordinates.split(",").map((value) => value.slice(2));
    const [x1, x2] = x.split("..").map((value) => Number.parseInt(value, 10));
    const [y1, y2] = y.split("..").map((value) => Number.parseInt(value, 10));
    const [z1, z2] = z.split("..").map((value) => Number.parseInt(value, 10));
    return {
      onOff: onOff === "on",
      x1,
      x2,
      y1,
      y2,
      z1,
      z2,
    };
  });
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const steps = await decodeInput(inputPath);
  console.log(steps);
  const cube: Record<string, boolean> = {};
  for (let i = 0; i < steps.length; i++) {
    const { onOff, x1, x2, y1, y2, z1, z2 } = steps[i];
    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          cube[`${x}${y}${z}`] = onOff;
        }
      }
    }
  }
  let total = 0;
  Object.keys(cube).forEach((key) => {
    if (cube[key]) total++;
  });
  return total;
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const decodedInputs = await decodeInput(inputPath);
  return 0;
};

const main = async () => {
  const resultFirstPuzzleTest = await resolveFirstPuzzle(TEST_INPUT_PATH);
  console.log("The result of the first puzzle test is:", resultFirstPuzzleTest);
  // const resultFirstPuzzle = await resolveFirstPuzzle(INPUT_PATH);
  // console.log("The result of the first puzzle is: ", resultFirstPuzzle);

  // const resultSecondPuzzleTest = await resolveSecondPuzzle(TEST_INPUT_PATH);
  // console.log(
  //   "The result of the second puzzle test is:",
  //   resultSecondPuzzleTest
  // );
  // const resultSecondPuzzle = await resolveSecondPuzzle(INPUT_PATH);
  // console.log("The result of the second puzzle is: ", resultSecondPuzzle);
};

main().catch((error) => {
  console.error(error);
});
