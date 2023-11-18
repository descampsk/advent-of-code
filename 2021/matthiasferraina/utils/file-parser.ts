import { fromFileUrl, join } from "../deps.ts";

export async function parseFileAsArray(
  absolutePath: string,
  relativePath: string,
): Promise<Array<string>> {
  const pathToFileToRead = getAbsoluteFilePath(absolutePath, relativePath);

  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(pathToFileToRead);
  const strData = decoder.decode(data);

  if (!strData) {
    return [];
  }

  return strData.split("\n");
}

export function getAbsoluteFilePath(
  absoluteUrl: string,
  relativePath: string,
): string {
  const absolutePath = fromFileUrl(absoluteUrl);
  const pathToFileToRead = join(absolutePath, "..", relativePath);
  return pathToFileToRead;
}

export async function parseFileContainingGroups(
  absoluteUrl: string,
  relativePath: string,
): Promise<Array<string>> {
  const data = await parseFileAsArray(absoluteUrl, relativePath);
  return data
    .reduce((acc, curr) => {
      if (curr) {
        acc += `${curr} `;
      } else {
        acc += ";#@";
      }
      return acc;
    }, "")
    .split(";#@")
    .map((el) => el.trim());
}
