from os.path import join, dirname
from heapq import heappush, heappop


def get_starts(matrix):
    return [
        (i, j)
        for i in range(len(matrix))
        for j in range(len(matrix[i]))
        if matrix[i][j] == 0
    ]


def get_adjacents(matrix, i, j):
    for di, dj in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        i1, j1 = i + di, j + dj
        if (
            0 <= i1 < len(matrix)
            and 0 <= j1 < len(matrix[0])
            and matrix[i1][j1] == matrix[i][j] + 1
        ):
            yield i1, j1


def dijkstra(matrix, i, j, part2=False):
    pq = [(0, i, j)]  # (height, i, j)
    total = 0
    visited = {(i, j)}
    while pq:
        height, i, j = heappop(pq)
        if matrix[i][j] == 9:
            total += 1
        else:
            for i1, j1 in get_adjacents(matrix, i, j):
                if (i1, j1) not in visited:
                    visited.add((i1, j1))
                    if not part2:
                        heappush(pq, (height + 1, i1, j1))
                if part2:
                    heappush(pq, (height + 1, i1, j1))
    return total


with open(join(dirname(__file__), "data.txt")) as f:
    matrix = [list(map(int, list(row))) for row in f.read().splitlines()]
starts = get_starts(matrix)

total = 0
for start in starts:
    res = dijkstra(matrix, *start)
    total += res
print("part1", total)

total = 0
for start in starts:
    res = dijkstra(matrix, *start, part2=True)
    total += res
print("part2", total)
