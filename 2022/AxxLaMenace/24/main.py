from os.path import join, dirname
from heapq import heappush, heappop

def dist_to_goal(i, j, i_goal, j_goal):
    return abs(i_goal - i) + abs(j_goal - j)

def get_adjacents(i, j, H, W):
    for dy, dx in (-1, 0), (0, -1), (0, 1), (1, 0), (0, 0):
        i1, j1 = i + dy, j + dx
        if 0 <= i1 <= H and 0 <= j1 <= W:
            yield (i1, j1)

def create_winds(matrix, matrix_t):
    horizontal_winds = [''.join([c if c in '<>' else '.' for c in row]) for row in matrix]
    vertical_winds = [''.join([c if c in '^v' else '.' for c in column]) for column in matrix_t]
    return horizontal_winds, vertical_winds

def is_wind(turn, i, j):
    row = horizontal_winds[i]
    right_wind = (j - turn) % len(row)
    left_wind = (j + turn) % len(row)
    if row[right_wind] == '>' or row[left_wind] == '<':
        return True
    column = vertical_winds[j]
    down_wind = (i - turn) % len(column)
    up_wind = (i + turn) % len(column)
    if column[down_wind] == 'v' or column[up_wind] == '^':
        return True
    return False

def move(start_turn, i0, j0, i_goal, j_goal):
    turn = start_turn + 1
    while is_wind(turn + 1, i0, j0):
        turn += 1

    heuristic = dist_to_goal(i0, j0, i_goal, j_goal) + turn
    start_state = (heuristic, turn, i0, j0)
    pq = [start_state]
    visited = {start_state}
    while pq:
        heuristic, turn, i, j = heappop(pq)
        new_turn = turn + 1
        for i1, j1 in get_adjacents(i, j, H, W):
            new_heuristic = dist_to_goal(i1, j1, i_goal, j_goal) + new_turn
            new_state = (new_heuristic, new_turn, i1, j1)
            if not is_wind(new_turn, i1, j1) and new_state not in visited:
                heappush(pq, new_state)
                visited.add(new_state)
                if i1 == i_goal and j1 == j_goal:
                    return new_turn + 1
    return move(start_turn + 1, i0, j0, i_goal, j_goal)

with open(join(dirname(__file__), 'data.txt')) as f:
    matrix = [row[1:-1] for row in f.read().splitlines()[1:-1]]

matrix_t = [*zip(*matrix)]
horizontal_winds, vertical_winds = create_winds(matrix, matrix_t)
H, W = len(matrix)-1, len(matrix[0])-1

turn = 0
turn = move(turn, 0, 0, H, W)
print('PART_1', turn)
turn = move(turn, H, W, 0, 0)
turn = move(turn, 0, 0, H, W)
print('PART_2', turn)
