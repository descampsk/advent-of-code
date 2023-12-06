from os.path import join, dirname
from collections import defaultdict
import math


def part_1(games):
    sum = 0
    for index, game in enumerate(games):
        ok = True
        for reveal in game.split("; "):
            for cube in reveal.split(", "):
                num, color = cube.split()
                if {"red": 12, "green": 13, "blue": 14}[color] < int(num):
                    ok = False
        if ok:
            sum += index + 1
    return sum


def part_2(games):
    sum = 0
    for game in games:
        d = defaultdict(int)
        for reveal in game.split("; "):
            for cube in reveal.split(", "):
                num, color = cube.split()
                d[color] = max(int(num), d[color])
        sum += math.prod(d.values())
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    data = [row.split(": ")[1] for row in f.read().splitlines()]
print("PART_1", part_1(data))
print("PART_2", part_2(data))
