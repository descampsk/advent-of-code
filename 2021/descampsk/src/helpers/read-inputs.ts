import { readFile } from "fs/promises";

export const readInputs = async (fileName: string): Promise<string[]> => {
  const file = await readFile(fileName, "utf-8");
  return file.split(/\r?\n/);
};

export const test = "test";
