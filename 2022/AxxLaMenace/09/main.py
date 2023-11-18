from os.path import join, dirname

def sign(x):
    return x//abs(x) if x else 0

def move_tail(head, tail):
    if (head[0] - tail[0])**2 + (head[1] - tail[1])**2 > 2:
        tail[0] += sign(head[0] - tail[0])
        tail[1] += sign(head[1] - tail[1])

def solve(data, rope_length):
    dir_map = {'R': (1, 0), 'L': (-1, 0), 'U': (0, 1), 'D': (0, -1)}
    nodes = [[0, 0] for _ in range(rope_length)]
    visited = {(0, 0)}
    for (direction, n) in data:
        for _ in range(n):
            nodes[0] = [sum(x) for x in zip(nodes[0], dir_map[direction])]
            for k in range(rope_length-1):
                move_tail(nodes[k], nodes[k+1])
            visited.add(tuple(nodes[-1]))
    return len(visited)

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [[dir, int(n)] for dir, n in [row.split() for row in f.read().splitlines()]]
print('PART_1', solve(data, 2))
print('PART_2', solve(data, 10))
