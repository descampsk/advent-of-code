import { assertEquals } from "../deps-dev.ts";
import { parseFileAsArray } from "./file-parser.ts";
const urlToCurrentFile = import.meta.url;

Deno.test("parseFileAsArray", async (t) => {
  await t.step("Given a file", async (t) => {
    await t.step("When it contains at least one line of text", async (t) => {
      await t.step(
        "Then it should return an array which each element is a line from the file",
        async () => {
          const expectedArray = [
            "200",
            "208",
            "210",
            "200",
            "207",
            "240",
            "269",
            "260",
            "263",
          ];
          const array = await parseFileAsArray(
            urlToCurrentFile,
            "mocks/mock-file",
          );
          assertEquals(array, expectedArray);
        },
      );
    });
    await t.step("When the file is empty", async (t) => {
      await t.step("Then it should return an empty array", async () => {
        const expectedArray: string[] = [];
        const array = await parseFileAsArray(
          urlToCurrentFile,
          "mocks/mock-file-empty",
        );
        assertEquals(array, expectedArray);
      });
    });
  });
});
