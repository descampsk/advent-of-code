from os.path import join, dirname
import math
import json
from functools import cmp_to_key

def compare_int(left, right):
    return -1 if left < right else 1 if left > right else 0

def compare(left, right):
    if type(left) == int:
        if type(right) == int: return compare_int(left, right)
        else: return compare([left], right)
    else:
        if type(right) == int: return compare(left, [right])
        else:
            for i in range(min(len(left), len(right))):
                a = compare(left[i], right[i])
                if a != 0:
                    return a
            return compare_int(len(left), len(right))

with open(join(dirname(__file__), 'data.txt')) as f:
    pairs = [[json.loads(line) for line in block.splitlines()] for block in f.read().split('\n\n')]

indices_right_order = [i+1 for i, p in enumerate(pairs) if compare(*p) <= 0]
print('PART_1', sum(indices_right_order))

dividers = [[[2]], [[6]]]
packets = [elem for pair in pairs for elem in pair] + dividers
packets.sort(key=cmp_to_key(compare))
print('PART_2', math.prod([i+1 for i, p in enumerate(packets) if p in dividers]))
