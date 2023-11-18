/* eslint-disable no-param-reassign */
import run from "aocrunner";
import { readFileSync } from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from "lodash";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const parseInput = (rawInput: string) => rawInput.split(/\r?\n/);
const testFile = join(
  dirname(fileURLToPath(import.meta.url)),
  "./input.test.txt",
).replace(/\/dist\//g, "/src/");
const inputTest = readFileSync(testFile, "utf-8");

type File = {
  name: string;
  size: number;
};

type Folder = {
  name: string;
  parent: string;
  subFolders: Record<string, string>;
  files: Record<string, File>;
  size: number;
};

const computeSize = (folder: Folder, folders: Record<string, Folder>) => {
  if (!folder.size) {
    if (!Object.keys(folder.subFolders).length) {
      if (!folder.size) {
        folder.size = Object.values(folder.files).reduce(
          (total, file) => total + file.size,
          0,
        );
      }
    } else {
      folder.size =
        Object.values(folder.files).reduce(
          (total, file) => total + file.size,
          0,
        ) +
        Object.keys(folder.subFolders).reduce(
          (total, subFolder) =>
            total + computeSize(folders[subFolder], folders),
          0,
        );
    }
  }
  return folder.size;
};

const createFolders = (lines: string[]) => {
  let i = 0;
  const folders: Record<string, any> = {
    "/": {
      name: "/",
      parent: null,
      files: {},
      subFolders: {},
    },
  };
  let currentFolder = folders["/"];
  while (lines[i]) {
    const line = lines[i];
    if (line.startsWith("$ cd")) {
      const folderName = line.substring(5);
      const fullName =
        folderName === "/" ? "/" : `${currentFolder.name}${folderName}/`;
      if (folderName === "..") {
        if (currentFolder.parent) {
          currentFolder = folders[currentFolder.parent];
        }
      } else if (!folders[fullName]) {
        throw new Error(`Folder ${fullName} does not exits`);
      } else {
        currentFolder = folders[fullName];
      }
    } else if (line.startsWith("$ ls")) {
      /* empty */
    } else if (line.startsWith("dir")) {
      const directory = line.substring(4);
      const fullName = `${currentFolder.name}${directory}/`;
      if (!folders[fullName]) {
        folders[fullName] = {
          name: fullName,
          parent: currentFolder.name,
          files: {},
          subFolders: {},
        };
        currentFolder.subFolders[fullName] = true;
      }
    } else {
      const [size, fileName] = line.split(" ");
      currentFolder.files[fileName] = {
        size: Number.parseInt(size, 10),
        fileName,
      };
    }
    i += 1;
  }
  return folders;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const folders = createFolders(lines);
  computeSize(folders["/"], folders);
  // console.log(JSON.stringify(folders));
  return Object.values(folders).reduce(
    (total, folder) => total + (folder.size < 100000 ? folder.size : 0),
    0,
  );
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const folders = createFolders(lines);
  computeSize(folders["/"], folders);
  // console.log(JSON.stringify(folders));
  const usedSize = folders["/"].size;
  let minSize = usedSize;
  for (const folder of Object.values(folders)) {
    if (70000000 - usedSize + folder.size > 30000000) {
      if (minSize > folder.size) {
        minSize = folder.size;
      }
    }
  }
  return minSize;
};

run({
  part1: {
    tests: [
      {
        input: inputTest,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: inputTest,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
