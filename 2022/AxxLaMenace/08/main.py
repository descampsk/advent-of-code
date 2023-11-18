from os.path import join, dirname

def get_edges(n):
    seen = set()
    for i in range(1, n-1):
        seen.add((i, 0))
        seen.add((i, n-1))
    for j in range(1, n-1):
        seen.add((0, j))
        seen.add((n-1, j))
    return seen


def find_visibles(i, j, matrix, current_size, visibles):
    size = matrix[i][j]
    if size > current_size:
        current_size = size
        if (i, j) not in visibles:
            visibles.add((i, j))
    return current_size

def puzzle_1(matrix, n, visibles):
    for i in range(n):
        current_size = -1
        for j in range(n):
            current_size = find_visibles(i, j, matrix, current_size, visibles)
        current_size = -1
        for j in reversed(range(n)):
            current_size = find_visibles(i, j, matrix, current_size, visibles)
    for j in range(n):
        current_size = -1
        for i in range(n):
            current_size = find_visibles(i, j, matrix, current_size, visibles)
        current_size = -1
        for i in reversed(range(n)):
            current_size = find_visibles(i, j, matrix, current_size, visibles)
    return len(visibles)

def score(matrix, matrix_t, i, j):
    size = matrix[i][j]
    right = matrix[i][j+1:]
    left = matrix[i][j-1::-1]
    down = matrix_t[j][i+1:]
    up = matrix_t[j][i-1::-1]
    score = compute_view(right, size) * compute_view(left, size) * compute_view(down, size) * compute_view(up, size)
    return score

def compute_view(direction, size):
    view = next((i+1 for i in range(len(direction)) if direction[i] >= size), len(direction))
    return view


with open(join(dirname(__file__), 'data.txt')) as f:
    matrix = [list(map(int, list(row))) for row in f.read().splitlines()]
    matrix_t = [*zip(*matrix)]
n = len(matrix)
visibles = get_edges(n)
print('PART_1', puzzle_1(matrix, n, visibles))

score_max = 0
for i in range(1, n-1):
    for j in range(1, n-1):
        new_score = score(matrix, matrix_t, i, j)
        score_max = max(score_max, new_score)
print('PART_2', score_max)
