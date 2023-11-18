import { assertEquals } from "../../deps-dev.ts";
import { parseFileAsArray } from "../../utils/file-parser.ts";
import { Command, pilot, pilotAndAim } from "./pilot.ts";

const pathToFile = import.meta.url;

Deno.test("pilot", async (t) => {
  await t.step("Given an array of commands", async (t) => {
    await t.step(
      "When the array contains values for the first advent case",
      async (t) => {
        await t.step("Then the pilot command should return 150", async () => {
          const expectedMeasurementCount = 150;
          const dataFromFile = await parseFileAsArray(
            pathToFile,
            "test/pilot.data.mock"
          );
          const data = dataFromFile.map((el) => el.split(" ")) as [
            Command,
            string
          ][];

          assertEquals(pilot(data), expectedMeasurementCount);
        });
      }
    );
  });
});

Deno.test("pilotAndAim", async (t) => {
  await t.step("Given an array of commands", async (t) => {
    await t.step(
      "When the array contains values for the second advent case",
      async (t) => {
        await t.step(
          "Then the pilotAndAim command should return 150",
          async () => {
            const expectedMeasurementCount = 900;
            const dataFromFile = await parseFileAsArray(
              pathToFile,
              "test/pilot.data.mock"
            );
            const data = dataFromFile.map((el) => el.split(" ")) as [
              Command,
              string
            ][];
            assertEquals(pilotAndAim(data), expectedMeasurementCount);
          }
        );
      }
    );
  });
});
