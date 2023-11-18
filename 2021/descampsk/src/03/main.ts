import { readInputs } from "../helpers/read-inputs";

const TEST_INPUT_PATH = `${__dirname}/input.test`;
const INPUT_PATH = `${__dirname}/input`;

const mostCommonBits = (lines: string[]): { "0": number; "1": number }[] => {
  const bits: { "0": number; "1": number }[] = [];
  lines.forEach((line) => {
    for (let i = 0; i < line.length; i += 1) {
      const bit = line[i];
      if (bits.length <= i) {
        bits.push({
          "0": 0,
          "1": 0,
        });
      }
      switch (bit) {
        case "0":
          bits[i]["0"] += 1;
          break;
        case "1":
          bits[i]["1"] += 1;
          break;
        default:
          break;
      }
    }
  });
  return bits;
};

const resolveFirstPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const bits = mostCommonBits(lines);

  const gammaAndEpsilonRates = bits.reduce(
    (previous, bit) => {
      const most1Bit = bit["1"] > bit["0"] ? "1" : "0";
      const least1Bit = bit["1"] > bit["0"] ? "0" : "1";
      const newValue = {
        gamma: `${previous.gamma}${most1Bit}`,
        epsilon: `${previous.epsilon}${least1Bit}`,
      };
      return newValue;
    },
    { gamma: "", epsilon: "" }
  );
  console.log(gammaAndEpsilonRates);
  return (
    parseInt(gammaAndEpsilonRates.epsilon, 2) *
    parseInt(gammaAndEpsilonRates.gamma, 2)
  );
};

const getRating = (lines: string[], type: "most" | "least"): string => {
  let rating = lines;
  let bitPosition = 0;
  let bits = mostCommonBits(lines);
  while (rating.length > 1 && bitPosition < bits.length) {
    let bitToCheck: "0" | "1";
    switch (type) {
      case "most":
        bitToCheck =
          bits[bitPosition]["0"] > bits[bitPosition]["1"] ? "0" : "1";
        break;
      case "least":
      default:
        bitToCheck =
          bits[bitPosition]["0"] > bits[bitPosition]["1"] ? "1" : "0";
        break;
    }
    rating = rating.filter(
      // eslint-disable-next-line no-loop-func
      (line) => line.charAt(bitPosition) === bitToCheck
    );
    bits = mostCommonBits(rating);
    bitPosition += 1;
  }

  return rating[0];
};

const resolveSecondPuzzle = async (inputPath: string) => {
  const lines = await readInputs(inputPath);
  const oxygenGeneratorRating = getRating(lines, "most");
  const c02ScrubberRating = getRating(lines, "least");
  return parseInt(oxygenGeneratorRating, 2) * parseInt(c02ScrubberRating, 2);
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
