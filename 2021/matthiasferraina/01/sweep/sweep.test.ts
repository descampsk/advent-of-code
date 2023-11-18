import { assertEquals } from "../../deps-dev.ts";
import { parseFileAsArray } from "../../utils/file-parser.ts";
import { sweep, sweepWindow } from "./sweep.ts";
const pathToFile = import.meta.url;

Deno.test("sweep", async (t) => {
  await t.step("Given an array of depths", async (t) => {
    await t.step("When the array contains increasing values", async (t) => {
      await t.step(
        "Then the sonarSweep should count 7 measurements larger than the previous measurement",
        async () => {
          const expectedMeasurementCount = 7;
          const dataFromFile = await parseFileAsArray(
            pathToFile,
            "test/sweep.data.mock",
          );
          const data = dataFromFile.map(Number);
          assertEquals(sweep(data), expectedMeasurementCount);
        },
      );
    });
  });
});

Deno.test("sweepWindow", async (t) => {
  await t.step("Given an array of depths", async (t) => {
    await t.step(
      "When the array contains increasing three-measurement sliding window sum",
      async (t) => {
        await t.step(
          "Then the sonarSweep should count measurements larger than the previous measurement",
          async () => {
            const expectedMeasurementCount = 5;
            const dataFromFile = await parseFileAsArray(
              pathToFile,
              "test/sweep.data.mock",
            );
            const data = dataFromFile.map(Number);
            assertEquals(sweepWindow(data), expectedMeasurementCount);
          },
        );
      },
    );
  });
});
