def update_hori(matrix):
    moved = False
    for i in range(len(matrix)):
        j = 0
        start = matrix[i][0]
        end = matrix[i][-1]
        while j < len(matrix[0])-1:
            if matrix[i][j] == '>' and matrix[i][j+1] == '.':
                matrix[i][j] = '.'
                matrix[i][j+1] = '>'
                j += 2
                moved = True
            else:
                j += 1
        if end == '>' and start == '.':
            matrix[i][0] = '>'
            matrix[i][-1] = '.'
            moved = True
    return moved

def update_vertical(matrix):
    moved = False
    for j in range(len(matrix[0])):
        i = 0
        start = matrix[0][j]
        end = matrix[-1][j]
        while i < len(matrix)-1:
            if matrix[i][j] == 'v' and matrix[i+1][j] == '.':
                matrix[i][j] = '.'
                matrix[i+1][j] = 'v'
                i += 2
                moved = True
            else:
                i += 1
        if end == 'v' and start == '.':
            matrix[0][j] = 'v'
            matrix[-1][j] = '.'
            moved = True
    return moved

with open("25/data.txt") as f:
    matrix = [[e for e in line] for line in f.read().splitlines()]

step, moved1, moved2 = 0, True, True
while moved1 or moved2:
    step += 1
    moved1 = update_hori(matrix)
    moved2 = update_vertical(matrix)
    print(step)
    # print('after', step, 'steps')
    # for row in matrix:
    #     print(''.join(row))

