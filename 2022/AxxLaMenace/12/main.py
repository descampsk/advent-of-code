from os.path import join, dirname
from heapq import heappush, heappop

def char_to_int(char):
    if char == 'S': return 0
    if char == 'E': return 27
    return ord(char) - 96

def find_start(data):
    return next((i, j) for j in range(len(data[0])) for i in range(len(data)) if data[i][j] == 27)

def get_adjacents(H, W, i, j):
    for dy, dx in (-1, 0), (0, -1), (0, 1), (1, 0):
        i1, j1 = i + dy, j + dx
        if 0 <= i1 < H and 0 <= j1 < W:
            yield (i1, j1)

def dijkstra(matrix, target=0):
    start = find_start(matrix)
    pq = [(0, *start)]
    visited = {start}
    H, W = len(matrix), len(matrix[0])
    while pq:
        dist, i, j = heappop(pq)
        for i1, j1 in get_adjacents(H, W, i, j):
            if matrix[i1][j1] >= matrix[i][j] - 1 and (i1, j1) not in visited:
                heappush(pq,(dist+1, i1, j1))
                visited.add((i1, j1))
                if matrix[i1][j1] == target:
                    return dist + 1

with open(join(dirname(__file__), 'data.txt')) as f:
    matrix = [list(map(char_to_int, list(line))) for line in f.read().splitlines()]
print('PART_1', dijkstra(matrix, target=0))
print('PART_2', dijkstra(matrix, target=1))
