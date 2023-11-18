import { assertEquals } from "../../deps-dev.ts";
import { parseFileAsArray } from "../../utils/file-parser.ts";
import {
  determineLifeSupportRating,
  determinePowerConsumption,
} from "./binary-diagnostic.ts";

const dataFromFile = await parseFileAsArray(
  `${import.meta.url}`,
  "test/binary-diagnostic.data.mock",
);
const binaryData = dataFromFile.map((el) => el.split("").map(Number));

Deno.test("determinePowerConsumption", async (t) => {
  await t.step("Given a binary diagnostic", async (t) => {
    await t.step("When the diagnostic is not null", async (t) => {
      await t.step(
        "Then it should return the power consumption (gammaRate * epsilonRate)",
        () => {
          const expectedPowerConsumption = 198;
          assertEquals(
            determinePowerConsumption(binaryData),
            expectedPowerConsumption,
          );
        },
      );
    });
  });
});

Deno.test("determineLifeSupportRating", async (t) => {
  await t.step("Given a binary diagnostic", async (t) => {
    await t.step("When the diagnostic is not null", async (t) => {
      await t.step(
        "Then it should return life support rating (oxygen generator rating * CO2 scrubber rating)",
        () => {
          const expectedLifeSupportRating = 230;
          assertEquals(
            determineLifeSupportRating(binaryData),
            expectedLifeSupportRating,
          );
        },
      );
    });
  });
});
