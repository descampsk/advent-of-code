from os.path import join, dirname
import re
import math


def part_1(mapping, commands, current="AAA"):
    step = 0
    while current[-1] != "Z":
        current = mapping[current][commands[step % len(commands)]]
        step += 1
    return step


def part_2(mapping, commands):
    steps = [part_1(mapping, commands, m) for m in mapping if m[-1] == "A"]
    return math.lcm(*steps)


with open(join(dirname(__file__), "data.txt")) as f:
    commands, node_lines = f.read().split("\n\n")
    nodes = node_lines.splitlines()
    mapping = {}
    for node in nodes:
        source, left, right = re.findall(r"\w+", node)
        mapping[source] = {"L": left, "R": right}

print("PART_1", part_1(mapping, commands))
print("PART_2", part_2(mapping, commands))
