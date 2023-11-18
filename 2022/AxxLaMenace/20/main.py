from os.path import join, dirname

def find_new_place(index, value, n):
    if value == 0:
        return index
    new_place = (index + value) % (n-1)
    if new_place == 0:
        return n-1
    return new_place

def mixing(data, positions):
    n = len(data)
    for i in range(n):
        index = positions.index(i)
        value = data.pop(index)
        pos = positions.pop(index)
        new_place = find_new_place(index, value, n)
        data.insert(new_place, value)
        positions.insert(new_place, pos)

def get_total(data):
    return sum(data[(coord+data.index(0)) % len(data)] for coord in [1000, 2000, 3000])

def solve(data, positions, rounds=1, decryption_key=1):
    data = [item * decryption_key for item in data]
    positions = list(range(len(data)))
    for _ in range(rounds):
        mixing(data, positions)
    return get_total(data)

with open(join(dirname(__file__), 'data.txt')) as f:
    data = list(map(int, f.read().splitlines()))
positions = list(range(len(data)))

print('PART_1', solve(data, positions))
print('PART_2', solve(data, positions, 10, 811589153))
