import { assertEquals } from "../../deps-dev.ts";
import { parseFileAsArray } from "../../utils/file-parser.ts";
import { puzzle1 } from "../main.puzzle1.ts";
import { puzzle2 } from "../main.puzzle2.ts";

Deno.test("puzzle1", async (t) => {
  await t.step("Given a ", async (t) => {
    await t.step("When the ", async (t) => {
      await t.step("Then it should return ", async () => {
        const dataFromFile = await parseFileAsArray(
          `${import.meta.url}`,
          "test/ventures.data.mock",
        );
        const data = dataFromFile;
        const expected = 5;

        assertEquals(puzzle1(data), expected);
      });
    });
  });
});

Deno.test("puzzle2", async (t) => {
  await t.step("Given a ", async (t) => {
    await t.step("When the ", async (t) => {
      await t.step("Then it should return ", async () => {
        const dataFromFile = await parseFileAsArray(
          `${import.meta.url}`,
          "test/ventures.data.mock",
        );
        const data = dataFromFile;
        const expected = 12;

        assertEquals(puzzle2(data), expected);
      });
    });
  });
});
