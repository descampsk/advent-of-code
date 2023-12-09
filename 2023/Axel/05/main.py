from os.path import join, dirname
import re
import time


def convert(mapping, seed):
    for line in mapping:
        desti, source, range = list(map(int, line.split()))
        if source <= seed < source + range:
            return desti + seed - source
    return seed


def part_1(data):
    seeds = list(map(int, re.findall(r"\d+", data[0])))
    for i in range(1, len(data)):
        mapping = data[i].splitlines()[1:]
        results = [convert(mapping, seed) for seed in seeds]
        seeds = results
    return min(results)


def convert_range(mapping, seeds):
    results = []
    for line in mapping:
        desti_y, y, dy = list(map(int, line.split()))
        to_handle = []
        for seed in seeds:
            x, dx = seed
            if dx == 0:
                continue
            elif (
                y + dy <= x or x + dx <= y
            ):  # pas d'intersection x[]...y() => 1 morceau non changé
                to_handle += [(x, dx)]
            else:
                if x <= y:
                    if (
                        x + dx <= y + dy
                    ):  # x[ y(...]x+dx )y+dy => 2 morceaux dont 1 changé
                        results += [(desti_y, x + dx - y)]
                        to_handle += [(x, y - x)]
                    else:  # x[ y(...)y+dy ]x+dx => 3 morceaux dont 1 changé
                        results += [(desti_y, dy)]
                        to_handle += [(x, y - x), (y + dy, x + dx - y - dy)]
                else:
                    if x + dx <= y + dy:  # y( x[...]x+dx )y+dy => 1 morceau changé
                        results += [(desti_y + x - y, dx)]
                    else:  # y( x[...)y+dy ]x+dx => 2 morceaux dont 1 changé
                        results += [(desti_y + x - y, y + dy - x)]
                        to_handle += [(y + dy, x + dx - y - dy)]
        seeds = to_handle
    total = results + to_handle
    return [(x, dx) for x, dx in total if dx != 0]


def part_2(data):
    seeds = list(
        map(lambda x: tuple(map(int, x.split())), re.findall(r"\d+ \d+", data[0]))
    )
    for i in range(1, len(data)):
        mapping = data[i].splitlines()[1:]
        results = convert_range(mapping, seeds)
        seeds = results
    return min(results)[0]


st = time.time()
with open(join(dirname(__file__), "data.txt")) as f:
    data = f.read().split("\n\n")

print("PART_1", part_1(data))
print("PART_2", part_2(data))
