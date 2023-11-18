import { assertEquals } from "../../deps-dev.ts";
import {
  drawVentures,
  filterHorizontalAndVerticalAndDiagonalLines,
  filterHorizontalAndVerticalLines,
  formatLine,
  formatLines,
  generateGridOfNDimension,
} from "./ventures.ts";

Deno.test("formatLine", async (t) => {
  await t.step("Given a line from file", async (t) => {
    await t.step("When it has as W as it length ", async (t) => {
      const line = "0,9 -> 5,9";
      await t.step("Then it should return an array of two coordinates", () => {
        const expectedArray = [
          { x: 0, y: 9 },
          { x: 5, y: 9 },
        ];
        assertEquals(formatLine(line), expectedArray);
      });
    });
  });
});

Deno.test("formatLines", async (t) => {
  await t.step("Given an array of lines from file", async (t) => {
    await t.step("When it has at two lines ", async (t) => {
      const lines = ["0,9 -> 5,9", "8,0 -> 0,8"];
      await t.step(
        "Then it should return a bidimensionnal array of coordinates",
        () => {
          const expectedArray = [
            [
              { x: 0, y: 9 },
              { x: 5, y: 9 },
            ],
            [
              { x: 8, y: 0 },
              { x: 0, y: 8 },
            ],
          ];
          assertEquals(formatLines(lines), expectedArray);
        },
      );
    });
  });
});

Deno.test("filterHorizontalAndVerticalLines", async (t) => {
  await t.step("Given an array of lines", async (t) => {
    await t.step(
      "When it has horizontal and vertical lines and one diagonal line",
      async (t) => {
        const lines = [
          [
            { x: 0, y: 9 },
            { x: 5, y: 9 },
          ],
          [
            { x: 8, y: 0 },
            { x: 0, y: 8 },
          ],
          [
            { x: 8, y: 0 },
            { x: 8, y: 3 },
          ],
        ];
        await t.step("Then it should exclude the diagonal line", () => {
          const expectedArray = [
            [
              { x: 0, y: 9 },
              { x: 5, y: 9 },
            ],
            [
              { x: 8, y: 0 },
              { x: 8, y: 3 },
            ],
          ];
          assertEquals(filterHorizontalAndVerticalLines(lines), expectedArray);
        });
      },
    );
  });
});

Deno.test("filterHorizontalAndVerticalAndDiagonalLines", async (t) => {
  await t.step("Given an array of lines", async (t) => {
    await t.step(
      "When it has 2 diagonale lines and one invalid line",
      async (t) => {
        const lines = [
          [
            { x: 0, y: 9 },
            { x: 5, y: 9 },
          ],
          [
            { x: 8, y: 0 },
            { x: 0, y: 8 },
          ],
          [
            { x: 8, y: 0 },
            { x: 8, y: 3 },
          ],
          [
            { x: 1, y: 1 },
            { x: 3, y: 3 },
          ],
          [
            { x: 3, y: 1 },
            { x: 1, y: 3 },
          ],
          [
            { x: 0, y: 0 },
            { x: 4, y: 5 },
          ],
        ];
        await t.step(
          "Then it should keep only horizontal, vertical and diagonal lines",
          () => {
            const expectedArray = [
              [
                { x: 0, y: 9 },
                { x: 5, y: 9 },
              ],
              [
                { x: 8, y: 0 },
                { x: 0, y: 8 },
              ],
              [
                { x: 8, y: 0 },
                { x: 8, y: 3 },
              ],
              [
                { x: 1, y: 1 },
                { x: 3, y: 3 },
              ],
              [
                { x: 3, y: 1 },
                { x: 1, y: 3 },
              ],
            ];
            assertEquals(
              filterHorizontalAndVerticalAndDiagonalLines(lines),
              expectedArray,
            );
          },
        );
      },
    );
  });
});

Deno.test("generateGridOfNDimension", async (t) => {
  await t.step("Given a dimension of 2 and a length of 10", async (t) => {
    await t.step("Itshould generate a bidimensionnal Grid", () => {
      const expectedGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      assertEquals(generateGridOfNDimension(10), expectedGrid);
    });
    await t.step("It should be possible to set the grid", () => {
      const expectedGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      const generatedGrid = generateGridOfNDimension(10);
      generatedGrid[4][4] = 1;

      assertEquals(generatedGrid, expectedGrid);
    });
  });
});

Deno.test("drawLines", async (t) => {
  await t.step("Given an array of lines", async (t) => {
    await t.step("When it has one horizontal or vertical line", async (t) => {
      const lines = [
        [
          { x: 0, y: 9 },
          { x: 5, y: 9 },
        ],
      ];
      const initialGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      await t.step("Then it should draw the horizontal ventures", () => {
        const expectedVentures = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        ];
        const ventures = drawVentures(lines, initialGrid);
        assertEquals(ventures, expectedVentures);
      });
    });

    await t.step("When it has one vertical line", async (t) => {
      const lines = [
        [
          { x: 1, y: 9 },
          { x: 1, y: 0 },
        ],
      ];
      const initialGrid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      await t.step("Then it should draw the vertical ventures", () => {
        const expectedVentures = [
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        const ventures = drawVentures(lines, initialGrid);
        assertEquals(ventures, expectedVentures);
      });
    });

    await t.step(
      "When it has one vertical line and one horizontal line crossing",
      async (t) => {
        const lines = [
          [
            { x: 1, y: 9 },
            { x: 1, y: 0 },
          ],
          [
            { x: 0, y: 9 },
            { x: 5, y: 9 },
          ],
        ];
        const initialGrid = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

        await t.step(
          "Then it should draw the ventures and a 2 should appear at crossing",
          () => {
            const expectedVentures = [
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
              [1, 2, 1, 1, 1, 1, 0, 0, 0, 0],
            ];
            const ventures = drawVentures(lines, initialGrid);
            assertEquals(ventures, expectedVentures);
          },
        );
      },
    );
  });
});
