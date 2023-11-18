import { readFile } from "fs/promises";

export const readInputs = async <T = string>(
  fileName: string
): Promise<T[]> => {
  const file = await readFile(fileName, "utf-8");
  return file.split(/\r?\n/) as T[];
};

export const test = "test";
