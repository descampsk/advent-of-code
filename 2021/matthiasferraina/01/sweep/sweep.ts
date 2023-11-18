// import { parseFileAsArray } from "../utils/file-parser.ts";

// const dataFromFile = await parseFileAsArray(`${import.meta.url}`, "1.data");
// const data = dataFromFile.map(Number);

export function sweep(data: number[]): number {
  let consecutiveIncreasingDeepNumber = 0;

  for (let index = 0; index < data.length - 1; index++) {
    const currentDeep = data[index];
    const nextDeep = data[index + 1];
    if (currentDeep < nextDeep) consecutiveIncreasingDeepNumber++;
  }

  return consecutiveIncreasingDeepNumber;
}

export function sweepWindow(data: number[]): number {
  let consecutiveWindowIncreasingDeepNumber = 0;
  let previousWindowSum = 0;

  for (let index = 0; index < data.length - 2; index++) {
    const currentWindowSum: number = data[index] + data[index + 1] +
      data[index + 2];

    if (previousWindowSum && previousWindowSum < currentWindowSum) {
      consecutiveWindowIncreasingDeepNumber++;
    }

    previousWindowSum = currentWindowSum;
  }
  return consecutiveWindowIncreasingDeepNumber;
}
