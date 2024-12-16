from os.path import join, dirname
from collections import Counter

with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, row.split())) for row in f.read().splitlines()]
a, b = map(sorted, zip(*data))

print(sum([abs(b[i] - a[i]) for i in range(len(a))]))

c = Counter(b)
print(sum([a[i] * c[a[i]] for i in range(len(a))]))
