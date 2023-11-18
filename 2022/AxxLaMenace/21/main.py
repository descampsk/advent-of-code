from os.path import join, dirname
from sympy import solve

def solve_part_1(d, start):
    def dfs(var):
        if not d[var].isdigit():
            left, op, right = d[var].split(' ')
            return f'({dfs(left)}) {op} ({dfs(right)})'
        return d[var]
    expression = dfs(start)
    return int(eval(expression))

def solve_part_2(d, start):
    d[start] = d[start].replace('+', '-')
    def dfs(var):
        if var == 'humn':
            return 'x'
        if not d[var].isdigit():
            left, op, right = d[var].split(' ')
            return f'({dfs(left)}) {op} ({dfs(right)})'
        return d[var]
    expression = dfs(start)
    return solve(expression)[0]

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [row.split(': ') for row in f.read().splitlines()]
d = {k: v for (k,v) in data}
print('PART_1', solve_part_1(d, 'root'))
print('PART_2', solve_part_2(d, 'root'))
