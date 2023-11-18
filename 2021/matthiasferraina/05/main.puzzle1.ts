import {
  drawVentures,
  filterHorizontalAndVerticalLines,
  formatLines,
  generateGridOfNDimension,
} from "./ventures/ventures.ts";

export function puzzle1(data: string[]): number {
  // format data
  const formattedData = formatLines(data);

  const verticalAndHorizontalLines = filterHorizontalAndVerticalLines(
    formattedData,
  );

  const initialVenturesGrid = generateGridOfNDimension(1000);
  const ventures = drawVentures(
    verticalAndHorizontalLines,
    initialVenturesGrid,
  );

  let count = 0;
  for (let i = 0; i < ventures.length; i++) {
    const el = ventures[i];
    for (let j = 0; j < el.length; j++) {
      const element = el[j];
      if (element > 1) count++;
    }
  }

  return count;
}
