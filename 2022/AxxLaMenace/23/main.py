from os.path import join, dirname
from collections import defaultdict

vectors = {
    'N': (-1, 0),
    'NE': (-1, 1),
    'E': (0, 1),
    'SE': (1, 1),
    'S': (1, 0),
    'SW': (1, -1),
    'W': (0, -1),
    'NW': (-1, -1),
}

cardinals = 'NSWE'

def get_borders(positions):
    all_pos = positions.keys()
    min_i = min(all_pos, key = lambda x: x[0])[0]
    max_i = max(all_pos, key = lambda x: x[0])[0]
    min_j = min(all_pos, key = lambda x: x[1])[1]
    max_j = max(all_pos, key = lambda x: x[1])[1]
    return (min_i, max_i, min_j, max_j)

def get_empty_tiles(positions):
    min_i, max_i, min_j, max_j = get_borders(positions)
    return (max_i - min_i + 1) * (max_j - min_j + 1) - len(positions)

def display_board(positions):
    min_i, max_i, min_j, max_j = get_borders(positions)
    matrix = [['.' for _ in range(max_j-min_j+1)] for _ in range(max_i-min_i+1)]
    for (i, j) in positions:
        matrix[i-min_i][j-min_j] = '#'
    for row in matrix:
        print(''.join(row))

def prepare_positions(data):
    positions = {}
    for i in range(len(data)):
        for j in range(len(data[i])):
            if data[i][j] == '#':
                positions[(i, j)] = None
    return positions

def get_neighbors(positions, i, j):
    neighbors = []
    for dir, (di, dj) in vectors.items():
        i1 = i + di
        j1 = j + dj
        if (i1, j1) in positions:
            neighbors.append(dir)
    return '-'.join(neighbors)

def get_new_position(direction, i, j):
    di, dj = vectors[direction]
    return i + di, j + dj

def propose_move(positions, next_moves, i, j, prios):
    neighbors = get_neighbors(positions, i, j)
    if not neighbors:
        return
    for direction in prios:
        # print('direction', direction, 'get_neighbors(positions, i, j)', get_neighbors(positions, i, j))
        if direction not in neighbors:
            i1, j1 = get_new_position(direction, i, j)
            positions[(i, j)] = (i1, j1)
            next_moves[(i1, j1)] += 1
            # print(f'PROPOSE MOVE FROM { i, j} TO {i1, j1}')
            return

def move(positions, next_moves, i, j):
    if positions[(i, j)]:
        i1, j1 = positions[(i, j)]
        if next_moves[(i1, j1)] == 1:
            positions[(i1, j1)] = (i1, j1)
            del positions[(i, j)]
            return 1
        else:
            positions[(i, j)] = None
    return 0

def make_step(positions, step = 0, display = True):
    next_moves = defaultdict(int)
    elves = set(positions.keys())
    prios = cardinals[(step%4):] + cardinals[:(step%4)]
    moves = 0
    for (i, j) in elves:
        propose_move(positions, next_moves, i, j, prios)
    for (i, j) in elves:
        moves += move(positions, next_moves, i, j)
    if display:
        print('\nEnd of Round', step+1, ', prios =', prios)
        display_board(positions)
    return moves

def solve_part_1(data):
    positions = prepare_positions(data)
    for step in range(10):
        make_step(positions, step, False)
    return get_empty_tiles(positions)

def solve_part_2(data):
    positions = prepare_positions(data)
    step = 0
    moves = 1
    while moves > 0:
        moves = make_step(positions, step, False)
        step += 1
    return step

with open(join(dirname(__file__), 'data.txt')) as f:
    data = f.read().splitlines()
positions = prepare_positions(data)

print('PART_1', solve_part_1(data))
print('PART_2', solve_part_2(data))
