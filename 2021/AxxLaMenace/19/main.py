import re
from itertools import combinations

def get_rotations():
    for i in (0,1,2):
        yield lambda v : (v[i-2], v[i-1], v[i])
        yield lambda v : (v[i-2], -v[i-1], -v[i])
        yield lambda v : (v[i-2], v[i], -v[i-1])
        yield lambda v : (v[i-2], -v[i], v[i-1])
        yield lambda v : (-v[i-2], v[i-1], -v[i])
        yield lambda v : (-v[i-2], -v[i-1], v[i])
        yield lambda v : (-v[i-2], v[i], v[i-1])
        yield lambda v : (-v[i-2], -v[i], -v[i-1])

def get_rotations_for_scanner(scanner, all_rotations):
    return tuple(tuple(rot(vec) for vec in scanner) for rot in all_rotations)

def get_rotation_and_translation(scanner_ref, new_scanner_rotations):
    for x0,y0,z0 in scanner_ref:
        for rot in new_scanner_rotations:
            for x1,y1,z1 in rot:
                dx,dy,dz = x0-x1, y0-y1, z0-z1
                other_coords = {(x+dx, y+dy, z+dz) for x,y,z in rot}
                intersection = scanner_ref.intersection(other_coords)
                if len(intersection) >= 12:
                    return True, other_coords, (dx,dy,dz)
    return False, None, None

def get_max_distance(positions):
    return max([abs(x2-x1)+abs(y2-y1)+abs(z2-z1) for (x1,y1,z1), (x2,y2,z2) in combinations(positions, 2)])

def solve_puzzle(scanners, rotations):
    all_beacons = set(scanners[0])
    to_visit = list(scanners.keys())
    to_visit.remove(0)
    index = 0
    translations = []
    while(to_visit):
        print('to_visit', len(to_visit))
        new_scanner_rotations = rotations[to_visit[index]]
        twelve_matches, other_coords_in_ref, translation = get_rotation_and_translation(all_beacons, new_scanner_rotations)
        if twelve_matches:
            all_beacons.update(other_coords_in_ref)
            to_visit.remove(to_visit[index])
            if index >= len(to_visit):
                index=0
            translations.append(translation)
        else:
            index = (index+1)%len(to_visit)
    return len(all_beacons), get_max_distance(translations)

with open("19/data.txt") as f:
    blocks = f.read().split('\n\n')
scanners = {}
rotations = {}
for elem in [block.split('\n') for block in blocks]:
    num_scanner = int(re.findall(r'--- scanner (\d+) ---', elem[0])[0])
    scanners[num_scanner] = [tuple(int(num) for num in coords.split(',')) for coords in elem[1:]]
    rotations[num_scanner] = tuple(tuple(rot(vec) for vec in scanners[num_scanner]) for rot in get_rotations())

nb_beacons, max_dist = solve_puzzle(scanners, rotations)
print("solution first puzzle", nb_beacons)
print("solution second puzzle", max_dist)



"""
REFLEXION

ROTATIONS
(x,y,z)
rotations selon x:
(x,-z,y)
(x,-y,-z)
(x,z,-y)
rotations selon y:
(-z,y,x)
(-x,y,-z)
(z,y,-x)
rotations selon z:
(-y,x,z)
(-x,-y,z)
(y,-x,z)


24 rotations possibles :
(x,y,z)
(x,-y,-z)
(x,z,-y)
(x,-z,y)

(-x,y,-z)
(-x,-y,z)
(-x,z,y)
(-x,-z,-y)

(y,z,x)
(y,-z,-x)
(y,x,-z)
(y,-x,z)

(-y,z,-x)
(-y,-z,x)
(-y,x,z)
(-y,-x,-z)

(z,x,y)
(z,-x,-y)
(z,y,-x)
(z,-y,x)

(-z,x,-y)
(-z,-x,y)
(-z,y,x)
(-z,-y,-x)

"""