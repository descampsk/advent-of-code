import { parseFileAsArray } from "../utils/file-parser.ts";
import { Command, pilot } from "./pilot/pilot.ts";

const dataFromFile = await parseFileAsArray(
  `${import.meta.url}`,
  "pilot/pilot.data",
);
const commands: [Command, string][] = dataFromFile.map((el) =>
  el.split(" ")
) as [Command, string][];

const count = pilot(commands);
