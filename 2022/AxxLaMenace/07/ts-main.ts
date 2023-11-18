import { readFileSync } from "fs";

class Node {
  name: string;
  parent: Node | null;
  children: Node[];
  size: number;
  isDir: boolean;

  constructor(name: string, parent?: Node, size = 0, isDir = false) {
    this.name = name;
    this.parent = parent || null;
    this.size = size;
    this.isDir = isDir;
    this.children = [];
  }

  addChild(name: string, size = 0, isDir = false): Node {
    const child = new Node(name, this, size, isDir);
    this.children.push(child);
    return child;
  }

  getChild(name: string): Node {
    return this.children.filter((child) => child.name === name)[0];
  }

  getSize(): number {
    if (!this.isDir) return this.size;
    return this.children.reduce((partialSum, child) => {
      return partialSum + child.getSize();
    }, 0);
  }
}

const createTree = (lines: string[], mainDir: Node) => {
  let currentDir = mainDir;
  lines.shift();

  lines.forEach((line) => {
    if (line.includes("$")) {
      const command = line.split(" ");
      if (command[1] === "cd") {
        if (command[2] === "..") {
          currentDir = currentDir.parent as Node;
        } else {
          currentDir = currentDir.getChild(command[2]);
        }
      }
    } else {
      const [dirOrSize, name] = line.split(" ");
      if (dirOrSize === "dir") currentDir.addChild(name, 0, true);
      else currentDir.addChild(name, Number(dirOrSize));
    }
  });
};

const findDirSizes = (
  currentDir: Node,
  currentPath: string,
  dirSizes: Record<string, number>
) => {
  currentDir.children
    .filter((child) => child.isDir)
    .forEach((subDir) => {
      const newPath = `${currentPath}/${subDir.name}`;
      dirSizes[newPath] = subDir.getSize();
      findDirSizes(subDir, newPath, dirSizes);
    });
};

const main = async () => {
  const file = readFileSync(`${__dirname}/data.txt`, "utf-8");
  const lines = file.split("\n");
  const mainDir = new Node("/", undefined, 0, true);
  createTree(lines, mainDir);
  const dirSizes: Record<string, number> = {
    [mainDir.name]: mainDir.getSize(),
  };
  findDirSizes(mainDir, mainDir.name, dirSizes);

  const sumSmallDirectories = Object.values(dirSizes).reduce(
    (partialSum, size) => {
      if (size < 100000) partialSum += size;
      return partialSum;
    },
    0
  );
  console.log("PART1", sumSmallDirectories);

  const spaceNeeded = 30000000 + mainDir.getSize() - 70000000;
  const sortedSizes = Object.values(dirSizes)
    .filter((num) => num >= spaceNeeded)
    .sort((a, b) => a - b);
  console.log("PART2", sortedSizes[0]);
};

main().catch((error) => console.error(error));

// DAY=07 npm run resolve
