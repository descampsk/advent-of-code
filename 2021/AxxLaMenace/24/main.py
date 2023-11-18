from collections import defaultdict

def confirm_solution(data, model):
    d = defaultdict(int)
    index = 0
    for line in data:
        op, *vars = line.split()
        if op == 'inp':
            d[vars[0]] = int(model[index])
            index += 1
        else:
            a, b = vars
            try: v = int(b)
            except ValueError: v = d[b]
            if op == 'add':
                d[a] += v
            elif op == 'mul':
                d[a] *= v
            elif op == 'div':
                if v != 1:
                    d[a] = int(d[a]/v)
            elif op == 'mod':
                d[a] = d[a]%v
            elif op == 'eql':
                d[a] = int(d[a]==v)
            else:
                raise ValueError('youhou', line)
    return d

def find_values(val, puzzle=1):
    if puzzle == 2:
        return (1+val, 1) if val > 0 else (1, 1-val)
    return (9, 9-val) if val > 0 else (9+val, 9)

def very_smart_solution(blocks, puzzle=1):
    z_store = []
    w = {}
    for index in range(len(blocks)):
        z_div, x_add, y_add = blocks[index]
        if x_add > 9:
            z_store.append((index, y_add))
        elif z_div == 26:
            old_index, old_y_add = z_store.pop()
            w[index], w[old_index] = find_values(old_y_add + x_add, puzzle)
        else:
            raise ValueError("wesh")
    return ''.join([str(w[i]) for i in range(14)])

with open("24/data.txt") as f:
    f_read = f.read()
    data = f_read.splitlines()
    blocks = [block.splitlines() for block in f_read.split('inp w\n')[1:]]
    blocks = [[block[3], block[4], block[14]] for block in blocks]
    blocks = [[int(s.split()[-1]) for s in block] for block in blocks]

solution_1 = very_smart_solution(blocks)
solution_2 = very_smart_solution(blocks, puzzle=2)
print('first puzzle solution', solution_1)
print('second puzzle solution', solution_2)
print(confirm_solution(data, solution_1))
print(confirm_solution(data, solution_2))


"""
REFLEXION et solution sans code

Chaque étape commençant par 'inp W' est similaire
Lorsque 'eql x w' est vrai, z est divisé par 26 et tronqué
Lorsque 'eql x w' est faux, z est divisé par 26 et tronqué, puis z = z*26 + w+add_y
Il faut donc essayer d'avoir 'eql x w' vrai le plus souvent possible
Cela nous force les choix de l'input w lorsque x est entre 1 et 9
On a x=z puis x = x%26, puis x = x-9 par ex



z_div = [1,1,1,1,26,1,26,1,26,26,1,26,26,26]
x_add = [11,14,10,14,-8,14,-11,10,-6,-9,12,-5,-4,-9]
y_add = [7,8,16,8,3,12,1,8,8,14,4,14,15,6]

x = z%26 + x_add
z = int(z/z_div)
si x != w, alors z = z*26 + w + y_add

premiers tours : z = 26*z+w+7
z = 0
z = 26*z + w0 + 7 = w0 + 7
FIN TOUR 0/13
x = (w0+7)%26 + 14 = w0 + 21
z = z*26 + w1 + 8 = 26*(w0+7) + w1+8
FIN TOUR 1
x = (26*(w0+7) + w1+8)%26 + 10 = (w1+8)%26 + 10 = w1 + 18 = w1 + y_add1 + x_add2
z = z/1
z = z*26 + w2 + 16 = 26*(26*(w0+7) + w1+8) + w2+16
FIN TOUR 2
x = (w2+16)%26 + 14 = w2 + 30
z = z / z_div3 = z/1
z = z*26 + w3 + 8 = 26*(26*(26*(w0+7) + w1+8) + w2+16) + w3 + 8
FIN TOUR 3
x = (w3+8)%26 - 8 = w3
z = int(z/26) = 26*(26*(w0+7) + w1+8) + w2+16   (car w3+8 < 26 donc ça jarte)
Comme x == w3, il faut choisir w4=w3 pour que z n'incrémente pas
FIN TOUR 4
x = w2+16 + 14 = w2 + 30
z = z*26 + w5 + 12 = 26*(26*(26*(w0+7) + w1+8) + w2+16) + w5+12
FIN TOUR 5
x = w5+12 - 11 = w5+1
z = int(z/26) = 26*(26*(w0+7) + w1+8) + w2+16   (car w5+12 < 26 donc ça jarte)
Il faut choisir w6 = w5+1 pour que z n'incrémente pas
FIN TOUR 6
x = w2+16 + 10 = w2 + 26 : forcément x != w7
z = z*26 + w7+8 = 26*(26*(26*(w0+7) + w1+8) + w2+16) + w7+8
FIN TOUR 7
x = w7+8 - 6 = w7+2
Il faut choisir w8 = w7+2
z = int(z/26) = 26*(26*(w0+7) + w1+8) + w2+16
FIN TOUR 8
x = w2+16 - 9 = w2 + 7
Il faut choisir w9 = w2+7
z = int(z/26) = 26*(w0+7) + w1+8
FIN TOUR 9
x = w1+8 + 12 = w1 + 20 : forcément w10 != x
z = 26*z + w10+4 = 26*(26*(w0+7) + w1+8) + w10+4
FIN TOUR 10
x = w10+4 - 5 = w10 - 1
Il faut choisir w11 = w10 - 1
z = int(z/26) = 26*(w0+7) + w1+8
FIN TOUR 11
x = w1+8 - 4
Il faut choisir w12 = w1 + 4
z = w0+7
FIN TOUR 12
x = w0+7 - 9
Il faut w13 = w0-2
z = 0


RECAP contraintes

w4 = w3
w6 = w5+1
w8 = w7+2
w9 = w2+7
w11 = w10 - 1
w12 = w1 + 4
w13 = w0-2

PROPOSITION MAX
w0 = 9
w1 = 5
w2 = 2
w3 = 9
w4 = 9
w5 = 8
w6 = 9
w7 = 7
w8 = 9
w9 = 9
w10 = 9
w11 = 8
w12 = 9
w13 = 7

Wmax = 95299897999897


PROPOSITION MIN
w0 = 3
w1 = 1
w2 = 1
w3 = 1
w4 = 1
w5 = 1
w6 = 2
w7 = 1
w8 = 3
w9 = 8
w10 = 2
w11 = 1
w12 = 5
w13 = 1

Wmin = 31111121382151




algo :
if x_add > 9:
    z_store.append(w_pos, y_add)
else:
    w_pos, y_add = z_store.pop()
    new_w_pos must equal w_pos_old + y_add_old + new_x_add (with max or min value)
    w_values[w_pos] = value found, etc

"""