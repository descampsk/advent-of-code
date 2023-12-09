from os.path import join, dirname
import math


def solve(a, b, c):
    delta = b**2 - 4 * a * c
    if delta > 0:
        return [(-b - delta**0.5) / (2 * a), (-b + delta**0.5) / (2 * a)]
    else:
        return []


def number_solutions(time, distance):
    res = solve(-1, time, -distance)
    nb = 0
    if len(res) == 2:
        if res[0].is_integer():
            nb -= 1
        if res[1].is_integer():
            nb -= 1
        nb += math.floor(res[0]) - math.ceil(res[1]) + 1
        return nb


def part_1(data):
    times, dists = list(map(lambda x: list(map(int, x.split(":")[1].split())), data))
    return math.prod(
        [number_solutions(-times[i], dists[i]) for i in range(0, len(times))]
    )


def part_2(data):
    time, dist = list(map(lambda x: int(x.split(":")[1].replace(" ", "")), data))
    return number_solutions(-time, dist)


with open(join(dirname(__file__), "data.txt")) as f:
    data = f.read().splitlines()

print("PART_1", part_1(data))
print("PART_2", part_2(data))
