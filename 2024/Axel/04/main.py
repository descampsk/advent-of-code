from os.path import join, dirname

target = "XMAS"
directions = [(1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1), (0, -1), (1, -1)]


def find_1(matrix, i0, j0):
    count = 0
    for di, dj in directions:
        letter_number = 0
        i, j = i0, j0
        while True:
            if letter_number == len(target):
                count += 1
                break
            if i < 0 or i >= len(matrix) or j < 0 or j >= len(matrix[0]):
                break
            if matrix[i][j] != target[letter_number]:
                break
            i += di
            j += dj
            letter_number += 1
    return count


def part_1(matrix):
    total = 0
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if matrix[i][j] == "X":
                total += find_1(matrix, i, j)
    return total


def find_2(matrix, i, j):
    directions = [(-1, -1), (-1, 1), (1, 1), (1, -1)]
    s = "".join(matrix[i + di][j + dj] for di, dj in directions)
    if s in ["MMSS", "SMMS", "SSMM", "MSSM"]:
        return 1
    return 0


def part_2(matrix):
    total = 0
    for i in range(len(matrix) - 1):
        for j in range(len(matrix[0]) - 1):
            if matrix[i][j] == "A":
                total += find_2(matrix, i, j)
    return total


with open(join(dirname(__file__), "data.txt")) as f:
    matrix = f.read().splitlines()

print(part_1(matrix))
print(part_2(matrix))
