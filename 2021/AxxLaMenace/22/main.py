import re
import numpy as np
from collections import Counter

def update(matrix, coords, on_off, size, offset):
    [x_min, x_max, y_min, y_max, z_min, z_max] = [int(e)+offset for e in coords]
    if x_max > 0 and x_min < size-1 \
    and y_max > 0 and y_min < size-1 \
    and z_max > 0 and z_min < size-1:
        x_min = max(0, x_min)
        x_max = min(size-1, x_max)
        y_min = max(0, y_min)
        y_max = min(size-1, y_max)
        z_min = max(0, z_min)
        z_max = min(size-1, z_max)
        for x in range(x_min, x_max+1):
            for y in range(y_min, y_max+1):
                for z in range(z_min, z_max+1):
                    matrix[x,y,z] = max(0, on_off)

def solve_first_puzzle(data):
    size = 101
    offset = 50
    matrix = np.zeros((size, size, size)).astype(int)
    for elem in data:
        [on_off, *coords] = elem
        update(matrix, coords, on_off, size, offset)
    return matrix.sum()

# PART 2
def intersection(coords1, coords2):
    x1_min, x1_max, y1_min, y1_max, z1_min, z1_max = coords1
    x2_min, x2_max, y2_min, y2_max, z2_min, z2_max = coords2
    x_min = max(x1_min, x2_min)
    x_max = min(x1_max, x2_max)
    y_min = max(y1_min, y2_min)
    y_max = min(y1_max, y2_max)
    z_min = max(z1_min, z2_min)
    z_max = min(z1_max, z2_max)
    if x_min<=x_max and y_min<=y_max and z_min<=z_max:
        return x_min, x_max, y_min, y_max, z_min, z_max

def nb_cubes(coords):
    x_min, x_max, y_min, y_max, z_min, z_max = coords
    return (x_max-x_min+1) * (y_max-y_min+1) * (z_max-z_min+1)

def solve_second_puzzle(data):
    total_cubes = Counter()
    for on_off1, *coords1 in data:
        temp = Counter()
        if on_off1 == 1:
            temp[tuple(coords1)] = on_off1
        for coords2, on_off2 in total_cubes.items():
            coords3 = intersection(coords1, coords2)
            if coords3:
                temp[coords3] -= on_off2
        total_cubes.update(temp)
    return sum([nb_cubes(coords)*on_off for coords,on_off in total_cubes.items()])

with open("22/data.txt") as f:
    reg = r'(-?\d+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)'
    data = [list(map(int, re.findall(reg, line.replace('on','1').replace('off','-1'))[0])) for line in f.read().splitlines()]
print('solution first puzzle', solve_first_puzzle(data))
print('solution second puzzle', solve_second_puzzle(data))


"""
REFLEXION
c1^c2 = intersection(c1, c2)
f(c1,c2) = cuboid allumée après c1, c2

si 2 cuboids : c1 ON, c2 ON
f(c1,c2) = c1 + c2 - c1^c2

si 2 cuboids : c1 ON, c2 OFF
f(c1,c2) = c1 - c1^c2

si 3 cuboids : c1 ON, c2 ON, c3 ON
cubes allumés à la fin : c1 + c2 - c1^c2 + c3 - c1^c3 - c2^c3 + c1^c2^c3 = f(c1, c2) + f(c3) - f(c1,c2)^c3


si 3 cuboids : c1 ON, c2 OFF, c3 ON
cubes allumés à la fin = c1.cubes - inter(c1,c2).cubes + c3.cubes - inter(c1,c3).cubes + inter(c1,c2,c3).cubes
cubes allumés à la fin = c1 - c1^c2 + c3 - c1^c3 + c1^c2^c3
où inter(c1,c2,c3).cubes = inter(inter(c1,c2), c3).cubes


f(c1...cn, cn+1) = f(c1...cn) - f(c1..cn)^cn+1 + f(cn+1)
si cn+1 est OFF, alors f(cn+1) = 0

"""
