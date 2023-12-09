from os.path import join, dirname
import math


def solve(data):
    return sum(
        sum(
            sum((-1) ** k * math.comb(n, k) * a[k] for k in range(n + 1))
            for n in range(len(a))
        )
        for a in data
    )


with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, row.split())) for row in f.read().splitlines()]

print("PART_1", solve([x[::-1] for x in data]))
print("PART_2", solve(data))
