def initial_increase(matrix):
    return [[matrix[i][j]+1 for j in range(len(matrix[0]))] for i in range(len(matrix))]

def compute_matrix_sum(matrix):
    return sum([sum([matrix[i][j] for j in range(len(matrix[0]))]) for i in range(len(matrix))])

def get_adjacents(m, i, j):
    adjacents = []
    for dy, dx in (-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1):
        i1, j1 = i + dy, j + dx
        if 0 <= i1 < len(m) and 0 <= j1 < len(m[0]):
            adjacents.append((i1, j1))
    return adjacents

def handle_flashes(m):
    nb_flash = 0
    while(True):
        check_again = False
        for i in range(len(m)):
            for j in range(len(m[0])):
                if m[i][j]>9:
                    for (i1,j1) in get_adjacents(m,i,j):
                        if m[i1][j1] > 0: m[i1][j1] += 1
                        if m[i1][j1] > 9: check_again = True
                    m[i][j]=0
                    nb_flash += 1
        if not check_again:
            break
    return nb_flash


def solve_first_puzzle(m):
    nb_total_flash = 0
    for _ in range(100):
        m = initial_increase(m)
        nb_total_flash += handle_flashes(m)
    return nb_total_flash

def solve_second_puzzle(m):
    step = 0
    while compute_matrix_sum(m):
        step+=1
        m = initial_increase(m)
        handle_flashes(m)
    return step

if __name__ == '__main__':
    with open("11/data.txt") as f:
        matrix = [[int(num) for num in line.strip()] for line in f]
        print("result first puzzle:", solve_first_puzzle(matrix))
        print("result second puzzle:", solve_second_puzzle(matrix))
