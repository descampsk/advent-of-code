from os.path import join, dirname
from collections import defaultdict


with open(join(dirname(__file__), "data.txt")) as f:
    data = [row.split(": ")[1].split("|") for row in f.read().splitlines()]

d = defaultdict(lambda: 1)
p1 = 0
p2 = 0
for i, line in enumerate(data):
    winning, possessed = line
    n = len(set(possessed.split()) & set(winning.split()))
    if n > 0:
        p1 += 2 ** (n - 1)
    for j in range(i + 1, i + 1 + n):
        d[j] += d[i]
    p2 += d[i]
print("PART_1", p1)
print("PART_2", p2)
