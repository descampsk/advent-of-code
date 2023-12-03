from os.path import join, dirname
from collections import defaultdict

limits = {"red": 12, "green": 13, "blue": 14}


def is_possible(game):
    ok = True
    for reveal in game.split("; "):
        for colored_cube in reveal.split(", "):
            num, color = colored_cube.split()
            if limits[color] < int(num):
                ok = False
    return ok


def part_1(games):
    sum = 0
    for index, game in enumerate(games):
        if is_possible(game):
            sum += index + 1
    return sum


def multiplyList(myList):
    result = 1
    for x in myList:
        result = result * x
    return result


def get_power(game):
    d = defaultdict(int)
    reveals = game.split("; ")
    for reveal in reveals:
        colored_cubes = reveal.split(", ")
        for colored_cube in colored_cubes:
            num, color = colored_cube.split()
            num = int(num)
            if num > d[color]:
                d[color] = num
    return multiplyList(d.values())


def part_2(games):
    sum = 0
    for game in games:
        sum += get_power(game)
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    games = [row.split(": ")[1] for row in f.read().splitlines()]
print("PART_1", part_1(games))
print("PART_2", part_2(games))
