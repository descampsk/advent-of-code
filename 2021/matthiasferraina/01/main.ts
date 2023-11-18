import { parseFileAsArray } from "../utils/file-parser.ts";
import { sweep, sweepWindow } from "./sweep/sweep.ts";

const dataFromFile = await parseFileAsArray(
  `${import.meta.url}`,
  "sweep/sweep.data",
);
const data = dataFromFile.map(Number);

const sonarSweep = sweep(data);
const sonarSweepWindow = sweepWindow(data);
