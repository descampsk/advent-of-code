from os.path import join, dirname

def transform(char):
    return ord(char) - ord('A') + 27 if char.isupper() else ord(char) - ord('a') + 1

def solve(data, puzzle=1):
    if puzzle == 1:
        items = [(set(ruck[:n]) & set(ruck[n:])).pop() for ruck in data if (n := len(ruck)//2)]
    else:
        items = [(set(data[i]) & set(data[i+1]) & set(data[i+2])).pop() for i in range(0, len(data), 3)]
    return sum(transform(item) for item in items)

with open(join(dirname(__file__), 'data.txt')) as f:
    data = f.read().splitlines()

print('PART_1', solve(data))
print('PART_2', solve(data, 2))
