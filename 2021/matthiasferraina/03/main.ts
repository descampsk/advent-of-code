import { parseFileAsArray } from "../utils/file-parser.ts";
import {
  determinePowerConsumption,
  determineLifeSupportRating,
} from "./binary-diagnostic/binary-diagnostic.ts";

const dataFromFile = await parseFileAsArray(
  `${import.meta.url}`,
  "pilot/pilot.data"
);

const commands = dataFromFile.map((el) => el.split("").map(Number));

const powerConsumption = determinePowerConsumption(commands);
const lifeSupportRating = determineLifeSupportRating(commands);