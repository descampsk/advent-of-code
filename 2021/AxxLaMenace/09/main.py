import math

def find_minima(m): # m = matrix
    return [(i, j, m[i][j]+1) for i in range(1, len(m)-1) for j in range(1, len(m[0])-1) \
        if m[i][j] == min(m[i][j], m[i+1][j], m[i-1][j], m[i][j+1], m[i][j-1])]

def solve_first_puzzle(m):
    return sum([int(mini[2]) for mini in find_minima(m)])

def surround_matrix_with_big_num(matrix, big_num=9):
    matrix = [[big_num]*len(matrix[0])] + matrix + [[big_num]*len(matrix[0])]
    return [[big_num] + row + [big_num] for row in matrix]

class Basin:
    def __init__(self, matrix, minimum) -> None:
        self.matrix = matrix
        self.neighbours = set()
        x, y = minimum
        self.points = {(x, y)}
        self.find_neighbours(x, y)
    
    def find_neighbours(self, x, y):
        for i,j in [(x-1,y), (x+1,y), (x,y-1), (x,y+1)]:
            if self.matrix[i][j] < 9 and (i, j) not in self.points and (i, j) not in self.neighbours:
                self.neighbours.add((i,j))
        self.points.add((x, y))

def solve_second_puzzle(m):
    minima = find_minima(m)
    basin_sizes = []
    for mini in minima:
        x, y, _ = mini
        b = Basin(m, (x, y))
        while b.neighbours:
            neighbour = b.neighbours.pop()
            b.find_neighbours(*neighbour)
        basin_sizes.append(len(b.points))
    return math.prod(sorted(basin_sizes)[-3:])

if __name__ == '__main__':
    with open("09/data.txt") as f:
        matrix = surround_matrix_with_big_num([[int(num) for num in line.strip()] for line in f])
        print("result first puzzle:", solve_first_puzzle(matrix))
        print("result second puzzle:", solve_second_puzzle(matrix))
