from os.path import join, dirname

vectors = {"^": (-1, 0), "v": (1, 0), "<": (0, -1), ">": (0, 1)}
wide = {"#": "##", "O": "[]", ".": "..", "@": "@."}


def find_start(matrix):
    return next(
        (i, j)
        for i in range(len(matrix))
        for j in range(len(matrix[i]))
        if matrix[i][j] == "@"
    )


def get_score(matrix):
    return sum(
        100 * i + j
        for i in range(len(matrix))
        for j in range(len(matrix[i]))
        if matrix[i][j] in ["O", "["]
    )


def create_wide_matrix(matrix):
    new_matrix = []
    for i in range(len(matrix)):
        s = "".join(wide[matrix[i][j]] for j in range(len(matrix[0])))
        new_matrix.append(list(s))
    return new_matrix


def move(matrix, i0, j0, dir):
    di, dj = vectors[dir]
    check = [(i0, j0)]
    visited = set()
    can_move = True
    while check:
        i, j = check.pop()
        if matrix[i][j] == "#":
            can_move = False
            break
        elif matrix[i][j] == ".":
            continue
        elif matrix[i][j] == "O" or matrix[i][j] == "@":
            visited.add((i, j))
            check.append((i + di, j + dj))
        elif matrix[i][j] == "[":
            visited.add((i, j))
            check.append((i + di, j + dj))
            if (i, j + 1) not in visited and (i, j + 1) not in check:
                check.append((i, j + 1))
        elif matrix[i][j] == "]":
            visited.add((i, j))
            check.append((i + di, j + dj))
            if (i, j - 1) not in visited and (i, j - 1) not in check:
                check.append((i, j - 1))
    if can_move:
        new_positions = {(i + di, j + dj) for i, j in visited}
        new_matrix = [row[:] for row in matrix]
        for i, j in visited:
            new_matrix[i + di][j + dj] = matrix[i][j]
        for i, j in visited.difference(new_positions):
            new_matrix[i][j] = "."
        return new_matrix, i0 + di, j0 + dj
    else:
        return matrix, i0, j0


def run(matrix, moves, display=False):
    i, j = find_start(matrix)
    for direction in moves:
        matrix, i, j = move(matrix, i, j, direction)
        if display:
            print("move", direction)
            for row in matrix:
                print("".join(row))
            input()
    return get_score(matrix)


with open(join(dirname(__file__), "data.txt")) as f:
    data = f.read().split("\n\n")
matrix = [list(row) for row in data[0].split("\n")]
moves = data[1].replace("\n", "")
wide_matrix = create_wide_matrix(matrix)

print(run(matrix, moves))
print(run(wide_matrix, moves, display=False))
