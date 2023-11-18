

def victory(matrix, desk_pos, len_desk):
    return all([matrix[i+di][j] == desk for di in range(len_desk) for desk, (i,j) in desk_pos.items()])

def display_matrix(matrix):
    for row in matrix:
        print(''.join(char for char in row))

def get_free_burrow(matrix, desk_pos, pos, len_desk):
    i1,j1 = pos
    desk = matrix[i1][j1]
    i2,j2 = desk_pos[desk]
    free_pos = []
    for di in range(len_desk):
        val = matrix[i2+di][j2]
        if val not in {desk, '.'}: return []
        elif val == '.' and all(matrix[1][j]=='.' for j in range(min(j1,j2), max(j1,j2)+1)):
            free_pos = [(i2+di,j2)]
    return free_pos
    # return set([matrix[i+di][j] for di in range(len_desk)]).issubset({desk, '.'})

def get_free_parkings(matrix, pos):
    parkings = [1, 2, 4, 6, 8, 10, 11]
    i1,j1 = pos
    if i1 == 1:
        return []
    free_parkings = []
    for j2 in parkings:
        if j2!=j1 and all(matrix[1][j]=='.' for j in range(min(j1,j2), max(j1,j2)+1) if j!=j1):
            free_parkings.append((1,j2))
    return free_parkings

def get_destinations(matrix, pos, desk_pos, len_desk=2):
    (i,j) = pos
    return get_free_parkings(matrix, pos) + get_free_burrow(matrix, desk_pos, pos, len_desk)

def update_matrix_and_mobile_amphi(matrix, pos, desti, mobile_amphi):
    new_matrix = [row[:] for row in matrix]
    new_mobile_amphi = mobile_amphi[:]
    if desti in get_free_parkings(new_matrix, pos):
        new_mobile_amphi.append(desti)
    i,j = pos
    i2,j2 = desti
    new_matrix[i2][j2] = new_matrix[i][j]
    new_matrix[i][j] = '.'
    if new_matrix[i+1][j] in ['A', 'B', 'C', 'D']:
        new_mobile_amphi.append((i+1,j))
    return new_matrix, new_mobile_amphi

def move(matrix, mobile_amphi, len_desk, depth):
    # print('mobile_amphi', mobile_amphi)
    # if depth == 3:
    #     return False, matrix
    if victory(matrix, desk_pos, len_desk):
        return True, matrix
    if not mobile_amphi or all(len(get_destinations(matrix, pos, desk_pos, len_desk))==0 for pos in mobile_amphi):
        return False, matrix
    success = False
    while(mobile_amphi):
        pos = mobile_amphi.pop(0)
        possible_desti = get_destinations(matrix, pos, desk_pos, len_desk)
        new_matrix = [row[:] for row in matrix]
        while(possible_desti and not success):
            new_matrix = [row[:] for row in matrix]
            print('possible_desti', possible_desti)
            desti = possible_desti.pop(0)
            display_matrix(new_matrix)
            print('depth', depth, 'pos', pos, new_matrix[pos[0]][pos[1]], 'desti', desti)
            new_matrix, new_mobile_amphi = update_matrix_and_mobile_amphi(new_matrix, pos, desti, mobile_amphi)
            display_matrix(new_matrix)
            print('mobile_amphi after', [new_matrix[i][j] for (i,j) in new_mobile_amphi])
            print('------------------------------------------------------')
            success, new_matrix = move(new_matrix, new_mobile_amphi, len_desk, depth+1)
            if success:
                return True, new_matrix
    return success, matrix


with open("23/data.txt") as f:
    puzzles = f.read().split('\n\n')
puzzles = [[[char for char in line] for line in puzzle.splitlines()] for puzzle in puzzles]

matrix = puzzles[0]
desk_pos = {'A': (2,3),'B': (2,5),'C': (2,7),'D': (2,9)}
len_desk = 2

# pos = (1,2)
# desti = (2,3)
# mobile_amphi = [pos]
# possible_destinations = get_destinations(matrix, pos, desk_pos, len_desk)
# print(possible_destinations)


# print(victory(matrix, desk_pos, len_desk))

# new_mat, new_mobile_amphi = update_matrix_and_mobile_amphi(matrix, pos, desti, mobile_amphi)
# print(new_mobile_amphi)
mobile_amphi = list(desk_pos.values())
success, new_mat = move(matrix, mobile_amphi, 1, 0)
print(success)
display_matrix(new_mat)

# new_matrix, new_mobile_amphi = update_matrix_and_mobile_amphi(matrix, (3, 9), (1, 11), [])


"""
REFLEXION PART 2
Il faut stocker la matrice
stocker le nombre de move possible par amphipod (2 au total)
lister tous les coups possibles :
- if move=0 ou pas de '.' adjacent : impossible
- il faut que des '.' jusqu'à la destination du move
- if move=1 il faut go desk
- if move=2 il peut go desk ou un des 7 parkings

Pour go desk, il faut empty desk ou que des amphipods même type dedans
Faire un arbre en bouclant sur les coups possibles à chaque fois
Dès qu'il n'y a plus de coup possible, essai raté
On liste les essais qui ont réussi et on prend celui avec le minimum d'énergie


def move():
    if victory(matrix, desk_pos, len_desk):
        return True
    if all(len(get_destinations(matrix, pos, desk_pos, len_desk))==0 for pos in mobile_amphi):
        return False
    success = False
    while(mobile_amphi):
        pos = mobile_amphi.pop(0)
        possible_desti = get_destinations(matrix, pos, desk_pos, len_desk))
        while(possible_desti and not success):
            desti = possible_desti.pop(0)
            update_matrix_and_mobile_amphi()
            success = move()
    return success
    



REFLEXION PART 1
minimum D : 7+7 = 14000
minimum C : 5+7 = 1200
minimum B : 6+7 = 130
minimum A : 2+3+6 = 11
big minimum impossible = 15341

A left : 3
A left : 6
B entre deskA et deskB : 50
C desk : 500
B right pas trop : 30
D desk x2 : 14000
B desk : 30 + 60
C desk : 700
A desk : 3+3

total : 14000 + 1200 + 170 + 15 = 15385
"""
