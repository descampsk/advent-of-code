from os.path import join, dirname

def sand_fall(matrix, y_max):
    count = 0
    while True:
        count += 1
        y = 0
        x = y_max
        while True:
            if matrix[y+1][x] == '.':
                y += 1
            elif matrix[y+1][x-1] == '.':
                y += 1
                x -= 1
            elif matrix[y+1][x+1] == '.':
                y += 1
                x += 1
            else:
                break
            if y >= y_max:
                return count - 1
        matrix[y][x] = 'o'
        if y == 0:
            return count

def get_segment(a, b):
    x1, y1, x2, y2 = [*a, *b]
    if x1 == x2:
        return [[x1, y] for y in range(min(y1, y2), max(y1, y2) + 1)]
    if y1 == y2:
        return [[x, y1] for x in range(min(x1, x2), max(x1, x2) + 1)]
    return [a, b]

def display_matrix(matrix, nb_cols, y_max):
    for row in matrix[:y_max+1]:
        print(''.join(row[:nb_cols]))

def solve(data, display=False, infinite_ground=False):
    rocks = sum([get_segment(group[i], group[i+1]) for group in data for i in range(len(group)-1)], [])
    y_max = max([elem[1] for elem in rocks]) + 2
    nb_cols = y_max * 2 + 1

    matrix = [['.' for _ in range(nb_cols)] for _ in range(y_max+1)]
    matrix[0][y_max] = "+"
    for x, y in rocks:
        matrix[y][x + y_max - 500] = "#"
    if infinite_ground:
        matrix[y_max][:] = ["#" for _ in range(nb_cols)] # PART 2

    count = sand_fall(matrix, y_max)
    if display:
        display_matrix(matrix, nb_cols, y_max)
    return count


with open(join(dirname(__file__), 'data.txt')) as f:
    data = [[list(map(int, pair.split(','))) for pair in row.split(' -> ')] for row in f.read().splitlines()]

print('PART_1', solve(data, display=False))
print('PART_2', solve(data, display=False, infinite_ground=True))

