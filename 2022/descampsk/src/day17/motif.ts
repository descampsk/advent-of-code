/* eslint-disable @typescript-eslint/no-non-null-assertion */
import _ from "lodash";

export const findMotif = (blocked: Map<number, Set<number>>, sizeMotif = 2) => {
  const max = _.max(Array.from(blocked.keys()))!;

  let motif = "";
  for (let i = 0; i < sizeMotif; i++) {
    motif += Array.from(blocked.get(max - i)!.keys())
      .sort()
      .join("");
  }

  for (let y = max - sizeMotif; y >= sizeMotif + 1; y -= 1) {
    let checkMotif = "";
    for (let i = 0; i < sizeMotif; i++) {
      checkMotif += Array.from(blocked.get(y - i)!.keys())
        .sort()
        .join("");
    }

    // console.log(checkMotif);

    if (checkMotif === motif) {
      return {
        found: true,
        motif,
        max,
        y,
      };
    }
  }

  return {
    found: false,
  };
};
