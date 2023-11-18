import { assertEquals } from "../../deps-dev.ts";
import { parseFileContainingGroups } from "../../utils/file-parser.ts";
import { puzzle2 } from "../main.puzzle2.ts";
import { puzzle1 } from "../main.puzzle1.ts";

Deno.test("puzzle1", async (t) => {
  await t.step("Given a ", async (t) => {
    await t.step("When the ", async (t) => {
      await t.step("Then it should return ", async () => {
        const dataFromFile = await parseFileContainingGroups(
          `${import.meta.url}`,
          "test/bingo.data.mock"
        );
        const data = dataFromFile;
        const expected = 4512;

        assertEquals(puzzle1(data), expected);
      });
    });
  });
});

Deno.test("puzzle2", async (t) => {
  await t.step("Given a ", async (t) => {
    await t.step("When the ", async (t) => {
      await t.step("Then it should return ", async () => {
        const expected = 1924;
        const dataFromFile = await parseFileContainingGroups(
          `${import.meta.url}`,
          "test/bingo.data.mock"
        );
        const data = dataFromFile;
        assertEquals(puzzle2(data), expected);
      });
    });
  });
});
