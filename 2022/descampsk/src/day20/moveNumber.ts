/* eslint-disable no-param-reassign */
export type extendedNumber = {
  value: number;
  hasMoved: boolean;
  initialIndex: number;
};

export const moveNumber = (
  numbers: (number | extendedNumber)[],
  numberToMove: number,
) => {
  if (!numbers.length) return numbers;
  const { length } = numbers;
  let index = 0;
  if (typeof numbers[0] === "number")
    index = numbers.findIndex((value) => value === numberToMove);
  else {
    let initialIndex = Infinity;
    index = 0;
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i] as extendedNumber;
      if (
        !number.hasMoved &&
        number.value === numberToMove &&
        number.initialIndex < initialIndex
      ) {
        index = i;
        initialIndex = number.initialIndex;
      }
    }
  }

  if (typeof numbers[index] !== "number")
    (numbers[index] as extendedNumber).hasMoved = true;

  let move = numberToMove % (length - 1);
  // eslint-disable-next-line no-continue
  if (move === 0) return numbers;
  if (move + index < length && move + index > 0) move += 0;
  if (move + index <= 0) move = move + length - 1;
  if (move + index >= length) move = move - length + 1;

  //   console.log(numberToMove, index, move);
  const newNumbers: (number | extendedNumber)[] = [];
  if (move > 0) {
    const beforeIndex = numbers.slice(0, index);
    // console.log("beforeIndex", beforeIndex);
    const afterIndexBeforeMove = numbers.slice(index + 1, index + 1 + move);
    // console.log("afterIndexBeforeMove", afterIndexBeforeMove);
    const afterIndex = numbers.slice(index + move + 1);
    // console.log("afterIndex", afterIndex);
    newNumbers.push(
      ...beforeIndex,
      ...afterIndexBeforeMove,
      numbers[index],
      ...afterIndex,
    );
  } else {
    const beforeMove = numbers.slice(0, index + move);
    // console.log("beforeMove", beforeMove);
    const afterMoveBeforeIndex = numbers.slice(index + move, index);
    // console.log("afterMoveBeforeIndex", afterMoveBeforeIndex);
    const afterIndex = numbers.slice(index + 1);
    // console.log("afterIndex", afterIndex);
    newNumbers.push(
      ...beforeMove,
      numbers[index],
      ...afterMoveBeforeIndex,
      ...afterIndex,
    );
  }

  //   console.log("newNumbers", newNumbers);
  if (newNumbers.length !== length) throw new Error("Bad reconstruction");
  return newNumbers;
};
