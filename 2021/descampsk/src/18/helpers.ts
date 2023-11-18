/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const addMostLeftOrRight = (
  pair: any,
  numberToAdd: number,
  leftOrRight: 0 | 1
) => {
  if (!Array.isArray(pair)) {
    pair += numberToAdd;
  } else if (!Array.isArray(pair[leftOrRight])) {
    pair[leftOrRight] += numberToAdd;
  } else if (!Array.isArray(pair[leftOrRight][leftOrRight])) {
    pair[leftOrRight][leftOrRight] += numberToAdd;
  } else if (!Array.isArray(pair[leftOrRight][leftOrRight][leftOrRight])) {
    pair[leftOrRight][leftOrRight][leftOrRight] += numberToAdd;
  } else {
    pair[leftOrRight][leftOrRight][leftOrRight][leftOrRight] += numberToAdd;
  }
  return pair;
};

export const explode = (pair: any[], index: number[]) => {
  if (index.length !== 4) {
    throw new Error(`index length should be 4 and is ${index.length}`);
  }
  const [i, j, k, l] = index;
  const newPair = [...pair];
  const pairToExplode = pair[i][j][k][l];
  newPair[i][j][k][l] = 0;

  // Change the other number in the pair which contains the pair to explode
  const indexToAdd = Math.abs(l - 1);
  if (Array.isArray(pair[i][j][k][indexToAdd])) {
    newPair[i][j][k][indexToAdd][l] += pairToExplode[indexToAdd];
  } else {
    newPair[i][j][k][indexToAdd] += pairToExplode[indexToAdd];
  }

  if (l === 0) {
    if (k) {
      newPair[i][j][0] = addMostLeftOrRight(
        newPair[i][j][0],
        pairToExplode[0],
        1
      );
    } else if (j) {
      newPair[i][0] = addMostLeftOrRight(newPair[i][0], pairToExplode[0], 1);
    } else if (i) {
      newPair[0] = addMostLeftOrRight(newPair[0], pairToExplode[0], 1);
    }
  } else if (!k) {
    newPair[i][j][1] = addMostLeftOrRight(
      newPair[i][j][1],
      pairToExplode[1],
      0
    );
  } else if (!j) {
    newPair[i][1] = addMostLeftOrRight(newPair[i][1], pairToExplode[1], 0);
  } else if (!i) {
    newPair[1] = addMostLeftOrRight(newPair[1], pairToExplode[1], 0);
  }

  return newPair;
};

export const checkExplodeOrSplit = (pair: any[], type: "split" | "explode") => {
  for (let i = 0; i < 2; i++) {
    if (!Array.isArray(pair[i])) {
      if (type === "split" && pair[i] >= 10) {
        return [i];
      }
    } else {
      for (let j = 0; j < 2; j++) {
        if (!Array.isArray(pair[i][j])) {
          if (type === "split" && pair[i][j] >= 10) {
            return [i, j];
          }
        } else {
          for (let k = 0; k < 2; k++) {
            if (!Array.isArray(pair[i][j][k])) {
              if (type === "split" && pair[i][j][k] >= 10) {
                return [i, j, k];
              }
            } else {
              for (let l = 0; l < 2; l++) {
                if (!Array.isArray(pair[i][j][k][l])) {
                  if (type === "split" && pair[i][j][k][l] >= 10) {
                    return [i, j, k, l];
                  }
                } else if (type === "explode") {
                  return [i, j, k, l];
                }
              }
            }
          }
        }
      }
    }
  }
  return [];
};

export const split = (pair: any[], index: number[]) => {
  const newPair = [...pair];
  switch (index.length) {
    case 1: {
      const [i] = index;
      newPair[i] = [Math.floor(pair[i] / 2), Math.round(pair[i] / 2)];
      break;
    }
    case 2: {
      const [i, j] = index;
      newPair[i][j] = [Math.floor(pair[i][j] / 2), Math.round(pair[i][j] / 2)];
      break;
    }
    case 3: {
      const [i, j, k] = index;
      newPair[i][j][k] = [
        Math.floor(pair[i][j][k] / 2),
        Math.round(pair[i][j][k] / 2),
      ];
      break;
    }
    case 4: {
      const [i, j, k, l] = index;
      newPair[i][j][k][l] = [
        Math.floor(pair[i][j][k][l] / 2),
        Math.round(pair[i][j][k][l] / 2),
      ];
      break;
    }
    default:
      break;
  }
  return newPair;
};

export const reduction = (pair: any[]) => {
  let indexExplode = checkExplodeOrSplit(pair, "explode");
  let indexSplit = indexExplode.length
    ? []
    : checkExplodeOrSplit(pair, "split");
  let newPair = [...pair];
  while (indexExplode.length || indexSplit.length) {
    if (indexExplode.length) {
      newPair = explode(newPair, indexExplode);
    } else if (indexSplit.length) {
      newPair = split(newPair, indexSplit);
    }
    indexExplode = checkExplodeOrSplit(newPair, "explode");
    indexSplit = indexExplode.length
      ? []
      : checkExplodeOrSplit(newPair, "split");
  }
  return newPair;
};

export const add = (firstPair: any[], secondPair: any[]) => {
  const copyFirstPair = JSON.parse(JSON.stringify(firstPair));
  const copySecondPair = JSON.parse(JSON.stringify(secondPair));
  const pair = [copyFirstPair, copySecondPair];
  return reduction(pair);
};

export const computeMagnitude = (pair: any): number => {
  if (!Array.isArray(pair)) {
    return pair;
  }
  return 3 * computeMagnitude(pair[0]) + 2 * computeMagnitude(pair[1]);
};
