from os.path import join, dirname

def solve_part_1(data):
    return sum((a <= c and b >= d) or (a >= c and b <= d) for a, b, c, d in data)

def solve_part_2(data):
    return sum((a <= c and b >= c) or (a >= c and a <= d) for a, b, c, d in data)

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [[int(section) for section in pair.replace('-', ',').split(',')] for pair in f.read().splitlines()]

print('PART_1', solve_part_1(data))
print('PART_2', solve_part_2(data))
