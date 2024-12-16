from os.path import join, dirname
import re


def get_solution(block, offset=0):
    x1, y1 = block[0]
    x2, y2 = block[1]
    x3, y3 = block[2]
    x3 += offset
    y3 += offset
    if x1 * y2 - x2 * y1 == 0:
        return 0
    a = (x3 * y2 - x2 * y3) / (x1 * y2 - x2 * y1)
    b = (x3 * y1 - x1 * y3) / (x2 * y1 - x1 * y2)
    if a.is_integer() and b.is_integer():
        return int(a * 3 + b)
    else:
        return 0


with open(join(dirname(__file__), "data.txt")) as f:
    data = [
        [list(map(int, re.findall(r"\d+", row))) for row in block.split("\n")]
        for block in f.read().split("\n\n")
    ]


print(sum(get_solution(block) for block in data))
print(sum(get_solution(block, 10_000_000_000_000) for block in data))
