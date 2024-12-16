from os.path import join, dirname
from heapq import heappush, heappop
from collections import defaultdict


def get_adjacents(matrix, i, j, borders):
    adjs = []
    for di, dj, dir in (0, -1, "W"), (1, 0, "S"), (0, 1, "E"), (-1, 0, "N"):
        i1, j1 = i + di, j + dj
        if (
            0 <= i1 < len(matrix)
            and 0 <= j1 < len(matrix[0])
            and matrix[i1][j1] == matrix[i][j]
        ):
            adjs.append((i1, j1))
        else:
            borders[dir].append((i, j))
    return adjs


def dijkstra(matrix, start):
    pq = [(1, *start)]
    visited = {start}
    borders = defaultdict(list)
    edges = 0
    while pq:
        dist, i, j = heappop(pq)
        adjs = get_adjacents(matrix, i, j, borders)
        edges += 4 - len(adjs)
        for i1, j1 in adjs:
            if (i1, j1) not in visited:
                heappush(pq, (dist + 1, i1, j1))
                visited.add((i1, j1))
    return visited, edges, borders


def count_borders(borders):
    nb_north = sum(
        1
        for i in range(len(borders["N"]))
        if (borders["N"][i][0], borders["N"][i][1] - 1) not in borders["N"]
    )
    nb_south = sum(
        1
        for i in range(len(borders["S"]))
        if (borders["S"][i][0], borders["S"][i][1] - 1) not in borders["S"]
    )
    nb_east = sum(
        1
        for i in range(len(borders["E"]))
        if (borders["E"][i][0] - 1, borders["E"][i][1]) not in borders["E"]
    )
    nb_west = sum(
        1
        for i in range(len(borders["W"]))
        if (borders["W"][i][0] - 1, borders["W"][i][1]) not in borders["W"]
    )
    return nb_north + nb_south + nb_east + nb_west


def run(matrix):
    all_visited = set()
    total_1, total_2 = 0, 0
    i, j = 0, 0
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if (i, j) not in all_visited:
                visited, edges, borders = dijkstra(matrix, (i, j))
                all_visited |= visited
                nb_borders = count_borders(borders)
                total_1 += edges * len(visited)
                total_2 += nb_borders * len(visited)
    return total_1, total_2


with open(join(dirname(__file__), "data.txt")) as f:
    matrix = [[c for c in row] for row in f.read().splitlines()]


print(run(matrix))
