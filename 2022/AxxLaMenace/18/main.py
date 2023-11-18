from os.path import join, dirname

def get_adjacents(coords, limits):
    xMin, xMax, yMin, yMax, zMin, zMax = limits
    for vector in [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]:
        x = coords[0] + vector[0]
        y = coords[1] + vector[1]
        z = coords[2] + vector[2]
        if xMin <= x <= xMax and yMin <= y <= yMax and zMin <= z <= zMax:
            yield (x, y, z)

def solve_part_1(data):
    total_exposed_faces = 0
    for cube in data:
        exposed_faces = 6
        for adj in get_adjacents(cube, find_size(data)):
            if adj in data:
                exposed_faces -= 1
        total_exposed_faces += exposed_faces
    return total_exposed_faces

def find_size(data):
    x = [a[0] for a in data]
    y = [a[1] for a in data]
    z = [a[2] for a in data]
    return min(x)-1, max(x)+1, min(y)-1, max(y)+1, min(z)-1, max(z)+1

def find_edge_cubes(limits):
    xMin, xMax, yMin, yMax, zMin, zMax = limits
    for x in range(xMin, xMax+1):
        for y in range(yMin, yMax+1):
            for z in range(zMin, zMax+1):
                if x in [xMin, xMax] or y in [yMin, yMax] or z in [zMin, zMax]:
                    yield (x, y, z)

def solve_part_2(data):
    limits = find_size(data)
    to_visit = set(find_edge_cubes(limits))
    visited = set()
    total_exposed_faces = 0
    while len(to_visit) > 0:
        cube = to_visit.pop()
        exposed_faces = 0
        for adj in get_adjacents(cube, limits):
            if adj in data:
                exposed_faces += 1
            elif adj not in to_visit and adj not in visited:
                to_visit.add(adj)
        visited.add(cube)
        total_exposed_faces += exposed_faces
    return total_exposed_faces


with open(join(dirname(__file__), 'data.txt')) as f:
    data = {tuple(map(int, row.split(','))) for row in f.read().splitlines()}

print('PART_1', solve_part_1(data))
print('PART_2', solve_part_2(data))
