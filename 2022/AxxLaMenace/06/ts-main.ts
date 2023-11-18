import { readFileSync } from "fs";

const findMarker = (data: string[], distincts: number) => {
  const marker: string[] = [];
  let count = 0;
  while (count < data.length) {
    marker.push(data[count]);
    count += 1;
    if (marker.length > distincts) marker.shift();
    if (new Set(marker).size == distincts) return count;
  }
};

const main = async () => {
  const file = readFileSync(`${__dirname}/data.txt`, "utf-8");
  const data = [...file];
  console.log(findMarker(data, 4));
  console.log(findMarker(data, 14));
};

main().catch((error) => console.error(error));

// DAY=06 npm run resolve
