from os.path import join, dirname

directions = ["N", "E", "S", "W"]
vectors = {"N": (-1, 0), "E": (0, 1), "S": (1, 0), "W": (0, -1)}


def find_start(matrix):
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if matrix[i][j] == "^":
                return i, j


def is_inside(matrix, i, j):
    return 0 <= i < len(matrix) and 0 <= j < len(matrix[0])


def move(matrix, i, j, dir, i2=None, j2=None):
    di, dj = vectors[dir]
    i1, j1 = i + di, j + dj
    if is_inside(matrix, i1, j1) and (matrix[i1][j1] == "#" or (i1 == i2 and j1 == j2)):
        return i, j, directions[(directions.index(dir) + 1) % 4]
    return i1, j1, dir


def part_1(matrix):
    i, j, dir = *find_start(matrix), "N"
    positions = set()
    while is_inside(matrix, i, j):
        positions.add((i, j))
        i, j, dir = move(matrix, i, j, dir)
    return positions


def part_2(matrix, all_positions):
    i0, j0 = find_start(matrix)
    rock_valid = 0
    for ir, jr in all_positions:
        if ir != i0 or jr != j0:
            matrix_copy = [row[:] for row in matrix]
            matrix_copy[ir][jr] = "#"
            i, j, dir = i0, j0, "N"
            visited = set((i0, j0, dir))
            while is_inside(matrix_copy, i, j):
                i, j, dir = move(matrix_copy, i, j, dir)
                if (i, j, dir) in visited:
                    rock_valid += 1
                    break
                visited.add((i, j, dir))
    return rock_valid


with open(join(dirname(__file__), "data.txt")) as f:
    matrix = [[elem for elem in row] for row in f.read().splitlines()]

positions = part_1(matrix)
print(len(positions))
print(part_2(matrix, positions))
