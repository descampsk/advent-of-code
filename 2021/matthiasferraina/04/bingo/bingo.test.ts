import { assertEquals } from "../../deps-dev.ts";
import {
  assertArrayIsBingo,
  assertGridIsBingo,
  computeBingoSum,
  transposeArray,
} from "./bingo.ts";

Deno.test("assertArrayIsBingo", async (t) => {
  await t.step("Given an array", async (t) => {
    await t.step("When it has as W as it length ", async (t) => {
      await t.step("Then it should return true ", () => {
        const array = ["W", "W", "W", "W", "W"];
        assertEquals(assertArrayIsBingo(array), true);
      });
    });
    await t.step("When it has as W as it length ", async (t) => {
      await t.step("Then it should return true ", () => {
        const array = ["1", "W", "W", "W", "W"];
        assertEquals(assertArrayIsBingo(array), false);
      });
    });
  });
});

Deno.test("assertGridIsBingo", async (t) => {
  await t.step("Given a grid", async (t) => {
    await t.step("Whenit has a winning raw", async (t) => {
      const grid = [
        ["W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "24"],
        ["W", "W", "W", "W", "7"],
        ["W", "W", "W", "W", "5"],
        ["1", "12", "20", "15", "19"],
      ];
      await t.step("Then it should return the true", () => {
        assertEquals(assertGridIsBingo(grid), true);
      });
    });
    await t.step("Whenit has a winning col", async (t) => {
      const grid = [
        ["W", "W", "W", "W", "0"],
        ["W", "W", "W", "W", "24"],
        ["W", "W", "W", "W", "7"],
        ["W", "W", "W", "W", "5"],
        ["W", "12", "20", "15", "19"],
      ];
      await t.step("Then it should return true", () => {
        assertEquals(assertGridIsBingo(grid), true);
      });
    });
  });
});

Deno.test("transposeArray", async (t) => {
  await t.step("Given an array", async (t) => {
    await t.step("Whenit has number values", async (t) => {
      const array = [
        [1, 1, 1],
        [2, 2, 2],
        [3, 3, 3],
      ];
      await t.step("Then it should return the transposedArray", () => {
        const expectedArray = [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
        ];
        assertEquals(transposeArray(array), expectedArray);
      });
    });
  });
});

Deno.test("computeBingoSum", async (t) => {
  await t.step("Given a bingo grid", async (t) => {
    const bingoGrid = [
      [22, 13, 17, 11, 0],
      [8, 2, 23, 4, 24],
      [21, 9, 14, 16, 7],
      [6, 10, 3, 18, 5],
      [1, 12, 20, 15, 19],
    ];
    await t.step("When it has a winning col", async (t) => {
      const array = [
        ["W", "W", "W", "W", "0"],
        ["W", "W", "W", "W", "24"],
        ["W", "W", "W", "W", "7"],
        ["W", "W", "W", "W", "5"],
        ["W", "12", "20", "15", "19"],
      ];
      await t.step(
        "Then it should return the sum of unmarked numbers, multiplied by the drawnNumber",
        () => {
          const drawnNumber = 22;
          assertEquals(
            computeBingoSum(bingoGrid, array, drawnNumber),
            (12 + 20 + 15 + 19 + 5 + 7 + 24 + 0) * 22
          );
        }
      );
    });

    await t.step("When it has a winning row", async (t) => {
      const array = [
        ["W", "W", "W", "W", "W"],
        ["W", "W", "W", "W", "24"],
        ["W", "W", "W", "W", "7"],
        ["W", "W", "W", "W", "5"],
        ["1", "12", "20", "15", "19"],
      ];
      await t.step(
        "Then it should return the sum of unmarked numbers, multiplied by the drawnNumber",
        () => {
          const drawnNumber = 19;
          assertEquals(
            computeBingoSum(bingoGrid, array, drawnNumber),
            (1 + 12 + 20 + 15 + 19 + 5 + 7 + 24) * 19
          );
        }
      );
    });
    await t.step("When it has no a winning row or col", async (t) => {
      const array = [
        ["22", "W", "17", "W", "0"],
        ["W", "2", "W", "W", "24"],
        ["W", "9", "14", "W", "7"],
        ["W", "10", "3", "18", "5"],
        ["W", "5", "W", "W", "W"],
      ];
      await t.step("Then it should return null", () => {
        const drawnNumber = 19;
        assertEquals(computeBingoSum(bingoGrid, array, drawnNumber), null);
      });
    });
  });
});

