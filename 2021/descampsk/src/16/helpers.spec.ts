import { decodeBinary, decodeHexa } from "./helpers";

describe("helpers", () => {
  describe("decodeBinary", () => {
    it.each([
      [
        "110100101111111000101000",
        { versions: [6], types: [4], numbers: [2021] },
      ],
      ["11010001010", { versions: [6], types: [4], numbers: [10] }],
      [
        "1101000101001010010001001000000000",
        { versions: [6], types: [4], numbers: [10] },
      ],
      ["01010010001001000000000", { versions: [2], types: [4], numbers: [20] }],
      [
        "00111000000000000110111101000101001010010001001000000000",
        {
          versions: [1, 6, 2],
          types: [6, 4, 4],
          totalLengthInBits: 27,
          numbers: [10, 20],
        },
      ],
      [
        "11101110000000001101010000001100100000100011000001100000",
        {
          versions: [7, 2, 4, 1],
          types: [3, 4, 4, 4],
          totalSubPackets: 3,
          numbers: [1, 2, 3],
        },
      ],
      [
        "01100010000000010111110000110110100001101011000110001010001111010100011110000000",
        {
          versions: [3, 7, 6, 5, 2, 2],
          types: [0, 4, 4, 4, 4, 4],
          totalSubPackets: 5,
          numbers: [6, 6, 12, 15, 15],
        },
      ],
    ])("decodeBinary %s should return", (input, expected) => {
      const output = decodeBinary(input);
      expect(output).toMatchObject(expected);
    });
  });

  describe("decodeHexa", () => {
    it.each([
      ["D2FE28", { versions: [6], types: [4], numbers: [2021] }],
      [
        "38006F45291200",
        {
          versions: [1, 6, 2],
          types: [6, 4, 4],
          totalLengthInBits: 27,
          numbers: [10, 20],
        },
      ],
      [
        "EE00D40C823060",
        {
          versions: [7, 2, 4, 1],
          types: [3, 4, 4, 4],
          totalSubPackets: 3,
          numbers: [1, 2, 3],
        },
      ],
      [
        "8A004A801A8002F478",
        {
          versions: [4, 1, 5, 6],
          types: [2, 2, 2, 4],
          totalSubPackets: 1,
          numbers: [15],
        },
      ],
      [
        "620080001611562C8802118E34",
        {
          versions: [3, 0, 0, 5, 1, 0, 3],
          types: [0, 0, 4, 4, 0, 4, 4],
          totalSubPackets: 2,
          numbers: [10, 11, 12, 13],
        },
      ],
      [
        "C0015000016115A2E0802F182340",
        {
          versions: [6, 0, 0, 6, 4, 7, 0],
          types: [0, 0, 4, 4, 0, 4, 4],
          numbers: [10, 11, 12, 13],
        },
      ],
      [
        "A0016C880162017C3686B18A3D4780",
        {
          versions: [5, 1, 3, 7, 6, 5, 2, 2],
          types: [0, 0, 0, 4, 4, 4, 4, 4],
          numbers: [6, 6, 12, 15, 15],
        },
      ],
      [
        "C200B40A82",
        {
          versions: [6, 6, 2],
          types: [0, 4, 4],
          numbers: [1, 2],
          value: 3,
        },
      ],
      [
        "04005AC33890",
        {
          versions: [0, 5, 3],
          types: [1, 4, 4],
          numbers: [6, 9],
          value: 54,
        },
      ],
      [
        "880086C3E88112",
        {
          versions: [4, 5, 6, 0],
          types: [2, 4, 4, 4],
          numbers: [7, 8, 9],
          value: 7,
        },
      ],
      [
        "CE00C43D881120",
        {
          versions: [6, 0, 5, 0],
          types: [3, 4, 4, 4],
          numbers: [7, 8, 9],
          value: 9,
        },
      ],
      [
        "D8005AC2A8F0",
        {
          types: [6, 4, 4],
          numbers: [5, 15],
          value: 1,
        },
      ],
      [
        "F600BC2D8F",
        {
          types: [5, 4, 4],
          numbers: [5, 15],
          value: 0,
        },
      ],
      [
        "9C005AC2F8F0",
        {
          types: [7, 4, 4],
          numbers: [5, 15],
          value: 0,
        },
      ],
      [
        "9C0141080250320F1802104A08",
        {
          types: [7, 0, 4, 4, 1, 4, 4],
          numbers: [1, 3, 2, 2],
          value: 1,
        },
      ],
    ])("decodeHexa %s should return", (input, expected) => {
      const output = decodeHexa(input);
      expect(output).toMatchObject(expected);
    });
  });
});
