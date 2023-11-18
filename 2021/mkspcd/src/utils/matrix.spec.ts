import { matrix } from './matrix'

describe('matrix', () => {
  describe('sumColumns', () => {
    it('sums the columns', () => {
      const input = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]

      const result = [12, 15, 18]

      expect(matrix.sumColumns(input)).toEqual(result)
    });
  });

  describe('getMostCommonBit', () => {
    it('gets the most common bit', () => {
      const input = [
        [0, 1, 1],
        [0, 1, 1],
        [1, 0, 1],
      ]

      const result = [0, 1, 1]

      expect(matrix.getMostCommonBit(input)).toEqual(result)
    });
  });
})