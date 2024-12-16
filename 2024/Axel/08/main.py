from os.path import join, dirname
from collections import defaultdict


def find_antennas(rows):
    antennas = defaultdict(list)
    for i, row in enumerate(rows):
        for j, char in enumerate(row):
            if char != ".":
                antennas[char].append((i, j))
    return antennas


def find_signal(i, j, u, v, H, W):
    res = set()
    i, j = i + u, j + v
    if 0 <= i < H and 0 <= j < W:
        res.add((i, j))
    return res


def find_all_signals(i, j, u, v, H, W):
    res = set()
    while 0 <= i < H and 0 <= j < W:
        res.add((i, j))
        i, j = i + u, j + v
    return res


def run(antennas, finder):
    signals = set()
    for positions in antennas.values():
        for a in range(len(positions)):
            for b in range(a + 1, len(positions)):
                i1, j1 = positions[a]
                i2, j2 = positions[b]
                u, v = i2 - i1, j2 - j1
                signals.update(finder(i1, j1, -u, -v, H, W))
                signals.update(finder(i2, j2, u, v, H, W))
    return len(signals)


with open(join(dirname(__file__), "data.txt")) as f:
    rows = f.read().splitlines()
H, W = len(rows), len(rows[0])
antennas = find_antennas(rows)


print(run(antennas, find_signal))
print(run(antennas, find_all_signals))
