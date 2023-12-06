from os.path import join, dirname
from collections import defaultdict
import re


def part_1(matrix):
    sum = 0
    for i in range(len(matrix)):
        for m in re.finditer(r"\d+", matrix[i]):
            is_part_number = False
            for x in range(i - 1, i + 2):
                for y in range(m.start() - 1, m.end() + 1):
                    if x >= 0 and x < len(matrix) and y >= 0 and y < len(matrix[0]):
                        if matrix[x][y] != "." and not matrix[x][y].isdigit():
                            is_part_number = True
            if is_part_number:
                sum += int(m.group())
    return sum


def part_2(matrix):
    stars = defaultdict(list)
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if matrix[i][j] == "*":
                for x in range(i - 1, i + 2):
                    for m in re.finditer(r"\d+", matrix[x]):
                        if m.start() - 1 <= j <= m.end():
                            stars[(i, j)] += [m.group()]
    sum = 0
    for star in stars.values():
        if len(star) == 2:
            sum += int(star[0]) * int(star[1])
    return sum


with open(join(dirname(__file__), "data.txt")) as f:
    data = f.read().splitlines()


print("PART_1", part_1(data))
print("PART_2", part_2(data))
