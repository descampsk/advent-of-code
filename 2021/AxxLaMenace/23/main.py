from collections import defaultdict
from copy import deepcopy
import math

ENTRIES = {'A': 3,'B': 5,'C': 7,'D': 9}
PARKINGS = [1, 2, 4, 6, 8, 10, 11]

def display_matrix(matrix, corridor, burrows):
    matrix = [row[:] for row in matrix]
    matrix[1] = corridor
    for group, j in ENTRIES.items():
        burrow_group = list(burrows[group])
        while len(burrow_group) < 4: burrow_group.append('.')
        i = 2
        for elem in reversed(burrows[group]):
            matrix[i][j] = elem
            i += 1
    for row in matrix:
        print(''.join(char for char in row))

def init_burrows(matrix):
    burrows = defaultdict(list)
    for group, j in ENTRIES.items():
        i = 2
        while matrix[i][j] != '#':
            if matrix[i][j] != '.':
                burrows[group].insert(0, matrix[i][j])
            i += 1
    return burrows, i-2

def init_corridor(matrix):
    return list(matrix[1])

def is_burrow_viable(burrow, group):
    return set(burrow).issubset({'.', group})

def is_burrow_full(burrow, group, len_burrow):
    return burrow == [group]*len_burrow

def victory(burrows, len_burrow):
    return all(is_burrow_full(burrow, group, len_burrow) for group, burrow in burrows.items())

def count_energy(start, desti, amphi):
    energy = {'A': 1,'B': 10,'C': 100,'D': 1000}
    return (max(start, desti) - min(start, desti)) * energy[amphi]

def path_exists(corridor, start, desti):
    return set(corridor[i] for i in range(min(start,desti), max(start,desti)+1) if i!=start)=={'.'}

def move_burrow_to_burrow(burrows, group_start, group_desti):
    burrows2 = deepcopy(burrows)
    amphipod = burrows2[group_start].pop()
    burrows2[group_desti].append(amphipod)
    return burrows2

def move_park_to_burrow(burrows, corridor, group, park):
    corridor2 = list(corridor)
    burrows2 = deepcopy(burrows)
    amphipod = corridor2[park]
    corridor2[park] = '.'
    burrows2[group].append(amphipod)
    return burrows2, corridor2

def move_to_parking(burrows, corridor, group, park):
    corridor2 = list(corridor)
    burrows2 = deepcopy(burrows)
    amphipod = burrows2[group].pop()
    corridor2[park] = amphipod
    return burrows2, corridor2

def big_move(burrows, corridor, len_burrow, current_energy=0, min_energy_for_now=math.inf):
    # print('burrows', burrows, 'corridor', ''.join(c for c in corridor))
    energies = []
    global_success = False
    if current_energy > min_energy_for_now:
        return False, current_energy
    if victory(burrows, len_burrow):
        print('VICTORY')
        # display_matrix(matrix, corridor, burrows)
        return True, current_energy
    for park in PARKINGS:
        group = corridor[park]
        if group!='.' and is_burrow_viable(burrows[group], group) and path_exists(corridor, park, ENTRIES[group]):
            burrows2, corridor2 = move_park_to_burrow(burrows, corridor, group, park)
            energy = count_energy(park, ENTRIES[group], group)
            success, new_energy = big_move(burrows2, corridor2, len_burrow, current_energy+energy, min_energy_for_now)
            if success:
                energies.append(new_energy)
                min_energy_for_now = min(min_energy_for_now, new_energy)
                global_success = True
            print('1 burrows2', burrows2, 'corridor2', ''.join(c for c in corridor2), energy)
            # energies.append(energy)
    for group, burrow in burrows.items():
        if not is_burrow_viable(burrow, group):
            amphi = burrow[-1]
            if is_burrow_viable(burrows[amphi], amphi) and path_exists(corridor, ENTRIES[group], ENTRIES[amphi]):
                burrows2 = move_burrow_to_burrow(burrows, group, amphi)
                energy = count_energy(ENTRIES[group], ENTRIES[amphi], amphi)
                success, new_energy = big_move(burrows2, corridor, len_burrow, current_energy+energy, min_energy_for_now)
                if success:
                    energies.append(new_energy)
                    min_energy_for_now = min(min_energy_for_now, new_energy)
                    global_success = True
                print('2 burrows2', burrows2, energy)
                # energies.append(energy)

            for park in PARKINGS:
                if corridor[park]=='.' and path_exists(corridor, ENTRIES[group], park):
                    burrows2, corridor2 = move_to_parking(burrows, corridor, group, park)
                    energy = count_energy(park, ENTRIES[group], amphi)
                    success, new_energy = big_move(burrows2, corridor2, len_burrow, current_energy+energy, min_energy_for_now)
                    if success:
                        energies.append(new_energy)
                        min_energy_for_now = min(min_energy_for_now, new_energy)
                        global_success = True
                    print('3 burrows2', burrows2, 'corridor2', ''.join(c for c in corridor2), energy)
                    # energies.append(energy)
    print('energies', energies)
    return global_success, min(energies) if energies else 100000


with open("23/data.txt") as f:
    puzzles = f.read().split('\n\n')
puzzles = [[[char for char in line] for line in puzzle.splitlines()] for puzzle in puzzles]

matrix = puzzles[0]
burrows, len_burrow = init_burrows(matrix)
# corridor = ['#']+['.']*11+['#']
corridor = init_corridor(matrix)
# display_matrix(matrix, ENTRIES, corridor, burrows)
energy = big_move(burrows, corridor, len_burrow)
print('FINAL', energy)

# print(count_energy(2, 5, 'D'))

# print(victory(burrows, len_burrow))

# for i in PARKINGS:
#     corridor[i] = "T"
# print(corridor)
# move_to_parking(burrows, corridor, ENTRIES, PARKINGS, 'A', 4)
# print('burrows', burrows, 'corridor', corridor)
# print(is_burrow_viable(burrows, 'A'))
# print(path_exists(corridor, 2,4))


"""
REFLEXION PART 2
corridor = ['#'] + ['.']*11 + ['#']
burrows = {
    'A': ['C', 'A'], le dernier élément de la liste est celui près du couloir
    ...
}
"""
