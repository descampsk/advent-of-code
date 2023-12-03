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


def findFirst(target_string, substring):
    pattern = re.compile("|".join([s for s in substring]))
    # match = pattern.search(target_string)
    print("pattern", pattern)
    return [(m.start(0), m.group(0)) for m in re.finditer(pattern, target_string)]

    # return (match.start(), match.group(0))


def find(target_string, substring):
    return [m.start(0) for m in re.finditer(substring, target_string)]


def findNumIndexes(s):
    patterns = list(d.keys()) + list(d.values())
    indexes = []
    for p in patterns:
        for f in find(s, p):
            indexes += [(f, p)]
    indexes.sort()
    matches = [indexes[0][1], indexes[-1][1]]
    output_list = list(map(lambda x: d[x] if x in d else x, matches))
    return int("".join(output_list))


def part_1(rows):
    sum = 0
    for row in rows:
        numStr = ""
        for c in row:
            if c.isdigit():
                numStr += c
                break
        for c in row[::-1]:
            if c.isdigit():
                numStr += c
                break
        if numStr.isdigit():
            sum += int(numStr)
    return sum


def part_2(rows):
    sum = 0
    for row in rows:
        num = findNumIndexes(row)
        sum += num
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    rows = [row for row in f.read().splitlines()]

# print("PART_1", part_1(rows))
# print("PART_2", part_2(rows))

print(findFirst("eightwo9three", list(d.keys()) + ["\d"]))
