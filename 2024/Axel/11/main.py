from os.path import join, dirname
from collections import defaultdict


def update_stone(num):
    s = str(num)
    if num == 0:
        return [1]
    elif len(s) % 2 == 0:
        return list(map(int, [s[: len(s) // 2], s[len(s) // 2 :]]))
    else:
        return [num * 2024]


def run(stones, iterations):
    for i in range(iterations):
        new_stones = defaultdict(int)
        for k, v in stones.items():
            updated_stones = update_stone(k)
            for stone in updated_stones:
                new_stones[stone] += v
        stones = new_stones
    return sum(stones.values())


with open(join(dirname(__file__), "data.txt")) as f:
    data = list(map(int, f.read().split()))

stones = {i: data.count(i) for i in data}

print(run(stones, 25))
print(run(stones, 75))
