import { converter } from './converter'

describe('converter', () => {
  describe('fromBinaryStringToDecimal', () => {
    it('converts a string of 1 and 0 to a base 10 number', () => {
      const n1 = '0001'
      const n5 = '0101'
      const n13 = '1101'
      
      expect(converter.fromBinaryStringToDecimal(n1)).toEqual(1)
      expect(converter.fromBinaryStringToDecimal(n5)).toEqual(5)
      expect(converter.fromBinaryStringToDecimal(n13)).toEqual(13)
    });
  });
})