import {
  checkExplodeOrSplit,
  computeMagnitude,
  explode,
  reduction,
  split,
} from "./helpers";

describe("helpers", () => {
  describe("checkExplodeOrSplit", () => {
    it.each([
      [[1, 2], []],
      [
        [
          [
            [9, [3, 8]],
            [[0, 9], 6],
          ],
          [
            [
              [3, 7],
              [4, 9],
            ],
            3,
          ],
        ],
        [],
      ],
      [
        [[[[[9, 8], 1], 2], 3], 4],
        [0, 0, 0, 0],
      ],
      [
        [7, [6, [5, [4, [3, 2]]]]],
        [1, 1, 1, 1],
      ],
      [
        [[6, [5, [4, [3, 2]]]], 1],
        [0, 1, 1, 1],
      ],
      [
        [
          [3, [2, [1, [7, 3]]]],
          [6, [5, [4, [3, 2]]]],
        ],
        [0, 1, 1, 1],
      ],
      [
        [
          [3, [2, [8, 0]]],
          [9, [5, [4, [3, 2]]]],
        ],
        [1, 1, 1, 1],
      ],
    ])("%o should return %o with explode", (input, expected) => {
      const output = checkExplodeOrSplit(input, "explode");
      expect(output).toEqual(expected);
    });

    it.each([
      [[[[[[9, 8], 1], 2], 3], 4], []],
      [
        [
          [
            [[0, 7], 4],
            [15, [0, 13]],
          ],
          [1, 1],
        ],
        [0, 1, 0],
      ],
      [
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, 13],
            ],
          ],
          [1, 1],
        ],
        [0, 1, 1, 1],
      ],
    ])("%o should return %o with split", (input, expected) => {
      const output = checkExplodeOrSplit(input, "split");
      expect(output).toEqual(expected);
    });
  });

  describe("explode", () => {
    it.each([
      [
        [[[[[9, 8], 1], 2], 3], 4],
        [[[[0, 9], 2], 3], 4],
      ],
      [
        [7, [6, [5, [4, [3, 2]]]]],
        [7, [6, [5, [7, 0]]]],
      ],
      [
        [[6, [5, [4, [3, 2]]]], 1],
        [[6, [5, [7, 0]]], 3],
      ],
      [
        [
          [3, [2, [1, [7, 3]]]],
          [6, [5, [4, [3, 2]]]],
        ],
        [
          [3, [2, [8, 0]]],
          [9, [5, [4, [3, 2]]]],
        ],
      ],
      [
        [
          [3, [2, [8, 0]]],
          [9, [5, [4, [3, 2]]]],
        ],
        [
          [3, [2, [8, 0]]],
          [9, [5, [7, 0]]],
        ],
      ],
      [
        [
          [
            [[[4, 3], 4], 4],
            [7, [[8, 4], 9]],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [7, [[8, 4], 9]],
          ],
          [1, 1],
        ],
      ],
      [
        [
          [
            [[0, 7], 4],
            [7, [[8, 4], 9]],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [15, [0, 13]],
          ],
          [1, 1],
        ],
      ],
      [
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, [6, 7]],
            ],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [6, 0],
            ],
          ],
          [8, 1],
        ],
      ],
    ])("%o should return %o", (input, expected) => {
      const index = checkExplodeOrSplit(input, "explode");
      const output = explode(input, index);
      expect(output).toEqual(expected);
    });
  });

  describe("split", () => {
    it.each([
      [
        [
          [
            [[0, 7], 4],
            [15, [0, 13]],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, 13],
            ],
          ],
          [1, 1],
        ],
      ],
      [
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, 13],
            ],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [0, [6, 7]],
            ],
          ],
          [1, 1],
        ],
      ],
    ])("split %o should return %o", (input, expected) => {
      const index = checkExplodeOrSplit(input, "split");
      const output = split(input, index);
      expect(output).toEqual(expected);
    });
  });

  describe("reduction", () => {
    it.each([
      [
        [
          [
            [[[4, 3], 4], 4],
            [7, [[8, 4], 9]],
          ],
          [1, 1],
        ],
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [6, 0],
            ],
          ],
          [8, 1],
        ],
      ],
    ])("reduction %o should return %o", (input, expected) => {
      const output = reduction(input);
      expect(output).toEqual(expected);
    });
  });

  describe("magnitude", () => {
    it.each([
      [[9, 1], 29],
      [
        [
          [9, 1],
          [1, 9],
        ],
        129,
      ],
      [
        [
          [1, 2],
          [[3, 4], 5],
        ],
        143,
      ],
      [
        [
          [
            [[0, 7], 4],
            [
              [7, 8],
              [6, 0],
            ],
          ],
          [8, 1],
        ],
        1384,
      ],
      [
        [
          [
            [
              [1, 1],
              [2, 2],
            ],
            [3, 3],
          ],
          [4, 4],
        ],
        445,
      ],
      [
        [
          [
            [
              [7, 8],
              [6, 6],
            ],
            [
              [6, 0],
              [7, 7],
            ],
          ],
          [
            [
              [7, 8],
              [8, 8],
            ],
            [
              [7, 9],
              [0, 6],
            ],
          ],
        ],
        3993,
      ],
    ])("magnitude %o should return %i", (input, expected) => {
      const output = computeMagnitude(input);
      expect(output).toEqual(expected);
    });
  });
});
