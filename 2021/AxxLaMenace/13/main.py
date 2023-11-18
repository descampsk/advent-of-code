def apply_fold(points, fold):
    dir = {'x':0, 'y':1}[fold[0]]
    value = int(fold[1])
    new_points, points_to_remove = set(), set()
    for point in points:
        if point[dir] > value:
            new_point = list(point)
            new_point[dir] = 2*value - point[dir]
            new_points.add(tuple(new_point))
            points_to_remove.add(point)
    return points - points_to_remove | new_points

def display_points(points):
    xMax = max(points ,key=lambda item:item[0])[0]
    yMax = max(points ,key=lambda item:item[1])[1]
    matrix = [['%' if (x,y) in points else ' ' for x in range(xMax+1)] for y in range(yMax+1)]
    return ('\n'.join([''.join(row) for row in matrix]))

def solve_second_puzzle(points, folds):
    for fold in folds: points = apply_fold(points, fold)
    return display_points(points)

if __name__ == '__main__':
    with open("13/data.txt") as f:
        blocks = f.read().split('\n\n')
        points = {tuple([int(n) for n in line.split(',')]) for line in blocks[0].split('\n')}
        folds = [line.replace('fold along ', '').split('=') for line in blocks[1].split('\n')]
        print("result first puzzle:", len(apply_fold(points, folds[0])))
        print("result second puzzle:", solve_second_puzzle(points, folds), sep='\n')
