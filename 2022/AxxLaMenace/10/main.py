from os.path import join, dirname

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [row.split() for row in f.read().splitlines()]
WIDTH = 40
x = 1
store = [x, x]
for elems in data:
    if len(elems)>1:
        x += int(elems[-1])
    store += [x]*len(elems)

print('PART_1', sum((i+1)*store[i] for i in range(19, 220, WIDTH)))

image = ''.join(['#' if abs(pixel%WIDTH - sprite) <= 1 else ' ' for pixel, sprite in enumerate(store)])
for i in range(0, len(image), WIDTH):
    print(image[i:i+WIDTH])