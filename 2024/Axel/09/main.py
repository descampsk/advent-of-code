from os.path import join, dirname


def prepare(data):
    fulls, empties, index, value = [], [], 0, 0
    for i, length in enumerate(data):
        if i % 2 == 0:
            fulls.append((index, length, value))
            value += 1
        else:
            empties.append((index, length))
        index += length
    return fulls, empties


def run(data, part1=False):
    fulls, empties = prepare(data)
    finals = []
    while fulls:
        f = fulls.pop()
        moved = False
        i = 0
        while i < len(empties):
            e = empties[i]
            if e[0] > f[0]:
                break
            if e[1] >= f[1]:
                finals.append((e[0], f[1], f[2]))
                empties[i] = (e[0] + f[1], e[1] - f[1])
                moved = True
                break
            elif e[1] < f[1] and part1:
                finals.append((e[0], e[1], f[2]))
                f = (f[0], f[1] - e[1], f[2])
                del empties[i]
            else:
                i += 1
        if not moved:
            finals.append(f)
    return sum(
        sum((index + i) * value for i in range(length))
        for (index, length, value) in finals
    )


with open(join(dirname(__file__), "data.txt")) as f:
    data = list(map(int, f.read()))

print(run(data, part1=True))
print(run(data))
