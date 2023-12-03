from os.path import join, dirname
from collections import defaultdict
import re


def get_adjacent(i, j_start, j_end, matrix):
    adjacent = []
    for x in range(i - 1, i + 2):
        for y in range(j_start - 1, j_end + 2):
            if x >= 0 and x < len(matrix) and y >= 0 and y < len(matrix[0]):
                if x != i or y < j_start or y > j_end:
                    adjacent += [matrix[x][y]]
    return adjacent


def part_1(matrix):
    sum = 0
    for index, line in enumerate(matrix):
        for m in re.finditer(r"\d+", line):
            value, start, end = m.group(), m.start(), m.end() - 1
            adjs = get_adjacent(index, start, end, matrix)
            if any([i for i in adjs if i != "." and not i.isdigit()]):
                sum += int(value)
    return sum


def part_2(matrix):
    stars = defaultdict(list)
    for i, line in enumerate(matrix):
        for j, char in enumerate(line):
            if char == "*":
                for x in range(i - 1, i + 2):
                    for m in re.finditer(r"\d+", matrix[x]):
                        value, start, end = m.group(), m.start(), m.end() - 1
                        if start - 1 <= j <= end + 1:
                            stars[(i, j)] += [value]
    sum = 0
    for star in stars.values():
        if len(star) == 2:
            sum += int(star[0]) * int(star[1])
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    matrix = [row for row in f.read().splitlines()]


print("PART_1", part_1(matrix))
print("PART_2", part_2(matrix))
