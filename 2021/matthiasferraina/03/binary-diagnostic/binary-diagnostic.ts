export function determinePowerConsumption(binaryData: number[][]): number {
  const gammaRate = [];
  for (let columnIndex = 0; columnIndex < binaryData[0].length; columnIndex++) {
    let zeroCount = 0;
    let oneCOunt = 0;
    for (let rowIndex = 0; rowIndex < binaryData.length; rowIndex++) {
      const scanned = binaryData[rowIndex][columnIndex];
      scanned === 0 && zeroCount++;
      scanned === 1 && oneCOunt++;
    }
    if (zeroCount > oneCOunt) {
      gammaRate.push(0);
    } else {
      gammaRate.push(1);
    }
    binaryData[columnIndex];
  }

  const epsilonRate = gammaRate.map((el) => (el === 0 ? 1 : 0));

  return binariToDecimal(gammaRate) * binariToDecimal(epsilonRate);
}

export function determineLifeSupportRating(binaryData: number[][]): number {
  const oxygenGeneratorRating = determineRating(binaryData);
  const co2GeneratorRating = determineRating(binaryData, 0);
  return oxygenGeneratorRating * co2GeneratorRating;
}

export const binariToDecimal = (binaries: number[]): number => {
  return parseInt(binaries.join(""), 2);
};

export const filterArrayByScanningColumn = (
  arrayToFilter: number[][],
  columnScanned: number,
  bitCriteria = 1,
): number[][] => {
  let zeroCount = 0;
  let oneCount = 0;
  for (let rowIndex = 0; rowIndex < arrayToFilter.length; rowIndex++) {
    const element = arrayToFilter[rowIndex][columnScanned];
    element === 0 && zeroCount++;
    element === 1 && oneCount++;
  }

  let filterCondition = zeroCount > oneCount ? 0 : 1;

  if (bitCriteria === 0) {
    filterCondition = zeroCount <= oneCount ? 0 : 1;
  }
  return arrayToFilter.filter((el) => el[columnScanned] === filterCondition);
};

export function determineRating(
  binaryData: number[][],
  bitCriteria = 1,
): number {
  let dataToFilter = binaryData;
  let index = 0;
  while (dataToFilter.length > 1) {
    dataToFilter = filterArrayByScanningColumn(
      dataToFilter,
      index,
      bitCriteria,
    );
    index++;
  }
  return binariToDecimal(dataToFilter[0]);
}
