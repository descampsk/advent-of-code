import { findMotif } from "./motif";

describe("findMotif", () => {
  it("should return true", () => {
    const blocked = new Map();
    blocked.set(1, new Set<number>([0]));
    blocked.set(2, new Set<number>([0, 1, 2]));
    blocked.set(3, new Set<number>([4, 5, 6]));
    blocked.set(4, new Set<number>([2, 6]));
    blocked.set(5, new Set<number>([0, 1, 2]));
    blocked.set(6, new Set<number>([4, 5, 6]));
    blocked.set(7, new Set<number>([2, 6]));
    blocked.set(8, new Set<number>([0, 1, 2]));

    const result = findMotif(blocked);
    expect(result.found).toBeTruthy();
    expect(result.motif).toEqual("01226");
    expect(result.y).toEqual(5);
  });
});
