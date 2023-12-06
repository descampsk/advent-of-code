from os.path import join, dirname
import re

d = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
}


def part_1(rows):
    sum = 0
    for row in rows:
        digits = [c for c in row if c.isdigit()]
        sum += int(digits[0] + digits[-1])
    return sum


def part_2(rows):
    sum = 0
    for row in rows:
        patterns = list(d.keys()) + list(d.values())
        indexes = []
        for p in patterns:
            for f in [m.start(0) for m in re.finditer(p, row)]:
                indexes += [(f, p)]
        indexes.sort()
        matches = [indexes[0][1], indexes[-1][1]]
        output_list = list(map(lambda x: d[x] if x in d else x, matches))
        sum += int("".join(output_list))
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    rows = f.read().splitlines()

print("PART_1", part_1(rows))
print("PART_2", part_2(rows))
