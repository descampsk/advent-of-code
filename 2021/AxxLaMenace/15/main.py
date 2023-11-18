import numpy as np
import time

def create_big_matrix(data, coef):
    temp = data.copy()
    for k in range(1, coef):
        temp = np.concatenate((temp, (data + k - 1) % 9 + 1), axis=1)
    big_matrix = temp.copy()
    for k in range(1, coef):
        big_matrix = np.concatenate((big_matrix, (temp + k - 1) % 9 + 1))
    return big_matrix

def get_adjacents(H, W, i, j):
    for dy, dx in (-1,0),(0,-1),(0,1),(1,0):
        i1, j1 = i + dy, j + dx
        if 0 <= i1 < H and 0 <= j1 < W:
            yield (i1, j1)

def find_min(cumulated, visited, to_visit):
    min = np.inf
    index = (-1, -1)
    for (i,j) in to_visit:
        if cumulated[i,j] < min:
            min = cumulated[i,j]
            index = (i, j)
    visited.add(index)
    return index

def solve_puzzle(risks):
    H, W = risks.shape
    cumulated = np.matrix(np.ones((H, W)) * np.inf)
    cumulated[0,0] = 0
    to_visit = {(0,0)}
    visited = set()
    a = 0
    (i,j) = -2, -2
    while cumulated[H-1,W-1] == np.inf:
        print(H*W - a)
        a+=1
        (i,j) = find_min(cumulated, visited, to_visit)
        for i1, j1 in get_adjacents(H, W, i, j):
            cumulated[i1,j1] = cumulated[i,j] + risks[i1,j1]
            if (i1,j1) not in visited: to_visit.add((i1,j1))
            if (i,j) in to_visit: to_visit.remove((i,j))
    print('RESULT', cumulated[H-1,W-1])

if __name__ == '__main__':
    with open("15/data.txt") as f:
        data = [[int(n) for n in line] for line in f.read().splitlines()]
    start_time = time.time()
    matrix = np.matrix(data)
    big_matrix = create_big_matrix(matrix, 5)
    solve_puzzle(matrix)
    # solve_puzzle(big_matrix)
    print("--- %s seconds ---" % (time.time() - start_time))


"""
RESULT 2829.0
81.72 seconds
"""