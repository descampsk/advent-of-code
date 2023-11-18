const checkVersionAndType = (version: number, type: number) => {
  console.log("version", version);
  console.log("type", type);

  if (
    version === undefined ||
    version === null ||
    Number.isNaN(version) ||
    version < 0
  ) {
    throw new Error("version is wrong");
  }

  if (type === undefined || type === null || Number.isNaN(type) || type < 0) {
    throw new Error("type is wrong");
  }
};

const decodeSubPacket = (binary: string) => {
  let number = "";
  let start = 0;
  let group = binary.slice(start, start + 5);
  while (group.charAt(0) === "1") {
    number += binary.slice(start + 1, start + 5);
    start += 5;
    group = binary.slice(start, start + 5);
  }
  number += binary.slice(start + 1, start + 5);
  return {
    number: parseInt(number, 2),
    lastBit: start + 5,
  };
};

const computeValue = (type: number, numbers: number[]) => {
  console.log(`Computing value with type ${type} and numbers ${numbers}`);
  switch (type) {
    case 0: {
      let value = 0;
      numbers.forEach((number) => {
        value += number;
      });
      return value;
    }
    case 1: {
      let value = 1;
      numbers.forEach((number) => {
        value *= number;
      });
      return value;
    }
    case 2: {
      return Math.min(...numbers);
    }
    case 3: {
      return Math.max(...numbers);
    }
    case 5: {
      if (numbers.length !== 2) {
        console.log(numbers);
        throw new Error("With type = 4, length must be 2");
      }
      return numbers[0] > numbers[1] ? 1 : 0;
    }
    case 6: {
      if (numbers.length !== 2) {
        console.log(numbers);
        throw new Error("With type = 5, length must be 2");
      }
      return numbers[0] < numbers[1] ? 1 : 0;
    }
    case 7: {
      if (numbers.length !== 2) {
        console.log(numbers);
        throw new Error("With type = 5, length must be 2");
      }
      return numbers[0] === numbers[1] ? 1 : 0;
    }
    default:
      return 0;
  }
};

export const decodeBinary = (binary: string) => {
  console.log("binary", binary);
  const version = parseInt(binary.slice(0, 3), 2);
  const type = parseInt(binary.slice(3, 6), 2);
  checkVersionAndType(version, type);

  const versions = [version];
  const types = [type];

  // Litteral value
  if (type === 4) {
    const { number, lastBit } = decodeSubPacket(binary.slice(6));
    return {
      versions,
      types,
      numbers: [number],
      lastBit: 6 + lastBit,
      value: number,
      values: [number],
    };
  }

  const lengthType = parseInt(binary.charAt(6), 10);
  console.log("lengthType", lengthType);

  // Subpacket with total length
  if (lengthType === 0) {
    const totalLengthInBits = parseInt(binary.slice(7, 22), 2);
    let bitsRead = 0;
    const numbers: number[] = [];
    const values: number[] = [];
    while (bitsRead < totalLengthInBits) {
      const {
        lastBit,
        numbers: subNumbers,
        versions: subVersions,
        types: subTypes,
        values: subValues,
      } = decodeBinary(binary.slice(22 + bitsRead));
      numbers.push(...subNumbers);
      values.push(...subValues);
      versions.push(...subVersions);
      types.push(...subTypes);
      bitsRead += lastBit;
    }

    if (bitsRead !== totalLengthInBits) {
      throw new Error("bitsRead is wrong");
    }

    const value = computeValue(type, values);

    return {
      versions,
      types,
      totalLengthInBits,
      numbers,
      lastBit: 22 + bitsRead,
      value,
      values: [value],
    };
  }

  if (lengthType === 1) {
    // Subpackets with numbers
    const totalSubPackets = parseInt(binary.slice(7, 18), 2);
    console.log("totalSubPackets", totalSubPackets);
    let bitsRead = 0;
    const numbers: number[] = [];
    const values: number[] = [];
    for (let i = 0; i < totalSubPackets; i++) {
      const {
        lastBit,
        numbers: subNumbers,
        versions: subVersions,
        types: subTypes,
        values: subValues,
      } = decodeBinary(binary.slice(18 + bitsRead));
      numbers.push(...subNumbers);
      values.push(...subValues);
      versions.push(...subVersions);
      types.push(...subTypes);

      bitsRead += lastBit;
      console.log("bitsRead", bitsRead);
    }

    const value = computeValue(type, values);

    return {
      versions,
      types,
      totalSubPackets,
      numbers,
      lastBit: 18 + bitsRead,
      value,
      values: [value],
    };
  }

  throw new Error("lengthType is wrong");
};

export const decodeHexa = (hexa: string) => {
  let binary = "";
  for (let i = 0; i < hexa.length; i++) {
    switch (hexa.charAt(i)) {
      case "0":
        binary += "0000";
        break;
      case "1":
        binary += "0001";
        break;
      case "2":
        binary += "0010";
        break;
      case "3":
        binary += "0011";
        break;
      case "4":
        binary += "0100";
        break;
      case "5":
        binary += "0101";
        break;
      case "6":
        binary += "0110";
        break;
      case "7":
        binary += "0111";
        break;
      case "8":
        binary += "1000";
        break;
      case "9":
        binary += "1001";
        break;
      case "A":
        binary += "1010";
        break;
      case "B":
        binary += "1011";
        break;
      case "C":
        binary += "1100";
        break;
      case "D":
        binary += "1101";
        break;
      case "E":
        binary += "1110";
        break;
      case "F":
        binary += "1111";
        break;
      default:
        break;
    }
  }

  return decodeBinary(binary);
};
