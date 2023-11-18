/* eslint-disable no-continue */
import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test.txt`;
const INPUT_PATH = `${__dirname}/input.txt`;

const resolvePuzzle = async (
  inputPath: string,
  cycles = 1,
  valueMultiplier = 1
) => {
  const lines = await readInputs<string>(inputPath);
  const elements = lines.map((value, index) => ({
    index,
    value: Number(value) * valueMultiplier,
  }));
  for (let cycle = 0; cycle < cycles; cycle++)
    for (let i = 0; i < elements.length; i++) {
      const elementIndex = elements.findIndex((element) => element.index === i);
      if (elementIndex === -1) throw new Error(`cannot find element ${i}`);

      const moduledValue = elements[elementIndex].value % (elements.length - 1);
      if (moduledValue === 0) continue;
      const newIndex = elementIndex + moduledValue;
      if (newIndex > 0 && newIndex < elements.length) {
        const element = elements.splice(elementIndex, 1)[0];
        elements.splice(newIndex, 0, element);
      } else if (newIndex <= 0) {
        const element = elements.splice(elementIndex, 1)[0];
        elements.splice(newIndex + elements.length, 0, element);
      } else {
        const element = elements.splice(elementIndex, 1)[0];
        elements.splice(
          (newIndex + elements.length) % elements.length,
          0,
          element
        );
      }
    }

  const findIndex1 =
    (elements.findIndex((el) => el.value === 0) + 1000) % elements.length;
  const findIndex2 =
    (elements.findIndex((el) => el.value === 0) + 2000) % elements.length;
  const findIndex3 =
    (elements.findIndex((el) => el.value === 0) + 3000) % elements.length;

  return (
    elements[findIndex1].value +
    elements[findIndex2].value +
    elements[findIndex3].value
  );
};

const main = async () => {
  const result1Test = await resolvePuzzle(TEST_INPUT_PATH, 1, 1);
  console.log("##  TEST 1  ##", result1Test);
  const result1 = await resolvePuzzle(INPUT_PATH, 1, 1);
  console.log("## RESULT 1 ##", result1); // (-619 929 1905) => 2215

  const result2Test = await resolvePuzzle(TEST_INPUT_PATH, 10, 811589153);
  console.log("##  TEST 2  ##", result2Test);
  const result2 = await resolvePuzzle(INPUT_PATH, 10, 811589153);
  console.log("## RESULT 2 ##", result2); // (-47883760027 1731931252502 -1675120011792) => 8927480683
};

main().catch((error) => console.error(error));
