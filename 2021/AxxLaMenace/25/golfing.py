import numpy as np

def update(matrix, sign):
    moved, dot = False, '.'
    for row in matrix:
        j, start, end = 0, row[0], row[-1]
        while j<len(matrix[0])-1:
            if row[j] == sign and row[j+1] == dot: row[j], row[j+1], j, moved = dot, sign, j+1, True
            j+=1
        if end==sign and start==dot:
            row[0], row[-1], moved = sign, dot, True
    return matrix, moved

with open("25/data.txt") as f:
    matrix =  np.array([[e for e in line] for line in f.read().splitlines()])
step, moved1, moved2 = 0, True, True
while moved1 or moved2:
    step += 1
    matrix, moved1 = update(matrix, '>')
    new_mat, moved2 = update(matrix.transpose(), 'v')
    matrix = new_mat.transpose()
    print(step)
