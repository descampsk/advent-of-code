def find_values(val, puzzle):
    if puzzle == 2: return (1+val, 1) if val > 0 else (1, 1-val)
    return (9, 9-val) if val > 0 else (9+val, 9)

def solve_puzzle(blocks, puzzle=1):
    z_store, w = [], {}
    for i in range(len(blocks)):
        x, y = blocks[i]
        if x > 9: z_store.append((i, y))
        else:
            i1, y1 = z_store.pop()
            w[i], w[i1] = find_values(y1 + x, puzzle)
    return ''.join([str(w[i]) for i in range(14)])

with open("24/data.txt") as f:
    blocks = [block.splitlines() for block in f.read().split('inp w\n')[1:]]
blocks = [[block[4], block[14]] for block in blocks]
blocks = [[int(s.split()[-1]) for s in block] for block in blocks]
print('first puzzle solution', solve_puzzle(blocks))
print('first puzzle solution', solve_puzzle(blocks, puzzle=2))
