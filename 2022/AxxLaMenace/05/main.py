from os.path import join, dirname
from collections import defaultdict

def solve(stacks_str, moves_str, puzzle=1):
    stacks = defaultdict(list)
    for row in stacks_str[::-1][1:]:
        for i in range(0, len(row)//4+1):
            if row[i*4+1] != ' ':
                stacks[i+1].append(row[i*4+1])
    moves = [map(int, [m[1], m[3], m[5]]) for m in [move.split(' ') for move in moves_str]]

    for a, b, c in moves:
        if puzzle == 1: stacks[c] += stacks[b][-a:][::-1]
        else: stacks[c] += stacks[b][-a:]
        stacks[b] = stacks[b][:-a]
    return ''.join([i[-1] for i in stacks.values()])


with open(join(dirname(__file__), 'data.txt')) as f:
    stacks_str, moves_str = [elem.splitlines() for elem in f.read().split('\n\n')]

print('PART_1', solve(stacks_str, moves_str))
print('PART_2', solve(stacks_str, moves_str, 2))
