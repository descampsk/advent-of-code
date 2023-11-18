import { moveNumber } from "./moveNumber";

describe("moveNumber", () => {
  it.each([
    { numbers: [], numberToMove: 1, expectedResult: [] },
    {
      numbers: [2, 1, 3],
      numberToMove: 2,
      expectedResult: [2, 1, 3],
    },
    {
      numbers: [4, 1, 3],
      numberToMove: 4,
      expectedResult: [4, 1, 3],
    },
    {
      numbers: [3, 1, 2],
      numberToMove: 3,
      expectedResult: [1, 3, 2],
    },
    {
      numbers: [-2, 1, 3],
      numberToMove: -2,
      expectedResult: [-2, 1, 3],
    },
    {
      numbers: [2, 1, 3],
      numberToMove: 1,
      expectedResult: [2, 3, 1],
    },
    {
      numbers: [1, 2, 3],
      numberToMove: 2,
      expectedResult: [1, 2, 3],
    },
    {
      numbers: [1, 3, 2],
      numberToMove: 3,
      expectedResult: [1, 2, 3],
    },
    {
      numbers: [1, 4, 2],
      numberToMove: 4,
      expectedResult: [1, 4, 2],
    },
    {
      numbers: [2, -1, 3],
      numberToMove: -1,
      expectedResult: [2, 3, -1],
    },
    {
      numbers: [1, -2, 3],
      numberToMove: -2,
      expectedResult: [1, -2, 3],
    },
    {
      numbers: [1, -3, 2],
      numberToMove: -3,
      expectedResult: [1, 2, -3],
    },
    {
      numbers: [1, -4, 2],
      numberToMove: -4,
      expectedResult: [1, -4, 2],
    },
    {
      numbers: [0, 4, 0],
      numberToMove: 4,
      expectedResult: [0, 4, 0],
    },
    {
      numbers: [0, 1, 2],
      numberToMove: 0,
      expectedResult: [0, 1, 2],
    },
    {
      numbers: [4, 5, 6, 1, 7, 8, 9],
      numberToMove: 1,
      expectedResult: [4, 5, 6, 7, 1, 8, 9],
    },
    {
      numbers: [4, -2, 5, 6, 7, 8, 9],
      numberToMove: -2,
      expectedResult: [4, 5, 6, 7, 8, -2, 9],
    },
    {
      numbers: [1, 2, -3, 3, -2, 0, 4],
      numberToMove: 1,
      expectedResult: [2, 1, -3, 3, -2, 0, 4],
    },
    {
      numbers: [2, 1, -3, 3, -2, 0, 4],
      numberToMove: 2,
      expectedResult: [1, -3, 2, 3, -2, 0, 4],
    },
    {
      numbers: [1, -3, 2, 3, -2, 0, 4],
      numberToMove: -3,
      expectedResult: [1, 2, 3, -2, -3, 0, 4],
    },
    {
      numbers: [1, 2, 3, -2, -3, 0, 4],
      numberToMove: 3,
      expectedResult: [1, 2, -2, -3, 0, 3, 4],
    },
    {
      numbers: [1, 2, -3, 0, 3, 4, -2],
      numberToMove: 0,
      expectedResult: [1, 2, -3, 0, 3, 4, -2],
    },
    {
      numbers: [1, 2, -3, 0, 3, 4, -2],
      numberToMove: 4,
      expectedResult: [1, 2, -3, 4, 0, 3, -2],
    },
    {
      numbers: [1, 2, -3, 0, 15, 4, -2],
      numberToMove: 15,
      expectedResult: [1, 15, 2, -3, 0, 4, -2],
    },
    {
      numbers: [1, 2, -3, 0, -20, 4, -2],
      numberToMove: -20,
      expectedResult: [1, 2, -20, -3, 0, 4, -2],
    },
    {
      numbers: [1, 2, -3, 0, -22, 4, -2],
      numberToMove: -22,
      expectedResult: [1, 2, -3, 0, 4, -2, -22],
    },
  ])(
    "should give the right result %p",
    ({
      numbers,
      numberToMove,
      expectedResult,
    }: {
      numbers: number[];
      numberToMove: number;
      expectedResult: number[];
    }) => {
      const result = moveNumber(numbers, numberToMove);
      expect(result).toEqual(expectedResult);
    },
  );
});
