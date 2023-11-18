from collections import deque
from math import floor, ceil
import json
from itertools import permutations

def add(a, b):
    return deque(['['] + list(a) + [','] + list(b) + [']'])

def explode(pair):
    stack, depth, last_int, to_add = [], 0, None, 0
    while pair:
        stack.append(pair.popleft())
        if stack[-1] == "[":
            if depth<4:
                depth += 1
            else:
                left = pair.popleft()
                coma = pair.popleft()
                right = pair.popleft()
                # print('boum', left, right)
                close_bracket = pair.popleft()
                if last_int: stack[last_int] += left + to_add
                to_add = right
                stack[-1] = 0
                last_int = len(stack) - 1
        elif stack[-1] == ']':
            depth -= 1
        elif isinstance(stack[-1], int):
            stack[-1] += to_add
            to_add = 0
            last_int = len(stack)-1
    return deque(stack)

def split(pair):
    stack = []
    splitted = False
    while pair:
        stack.append(pair.popleft())
        if isinstance(stack[-1], int) and stack[-1] > 9 and not splitted:
            val = stack[-1]
            stack.pop()
            stack += ['[', floor(val/2), ',', ceil(val/2), ']']
            splitted = True
            # print('split', val)
    return deque(stack), splitted

def reduce(pair):
    has_split = True
    while has_split:
        pair = explode(pair)
        pair, has_split = split(pair)
    return pair

def magnitude(arr):
    if type(arr) != list:
        return arr
    else:
        a,b = arr
        return 3*magnitude(a) + 2*magnitude(b)

def solve_first_puzzle(data):
    big_sum = data[0]
    for elem in data[1:]:
        big_sum = add(big_sum, elem)
        big_sum = reduce(big_sum)
    big_sum = [str(c) if isinstance(c, int) else c for c in big_sum]
    big_sum_as_list = json.loads("".join(big_sum))
    print(big_sum_as_list)
    print(magnitude(big_sum_as_list))

def solve_second_puzzle(data):
    max_magni = 0
    for (a, b) in permutations(data, 2):
        print('max_magni', max_magni)
        big_sum = add(a, b)
        big_sum = reduce(big_sum)
        big_sum = [str(c) if isinstance(c, int) else c for c in big_sum]
        big_sum_as_list = json.loads("".join(big_sum))
        new_magni = magnitude(big_sum_as_list)
        # print(new_magni)
        if new_magni > max_magni:
            max_magni = new_magni
    print('final result max_magni', max_magni)


if __name__ == '__main__':
    with open("18/data.txt") as f:
        data = f.read().splitlines()
        data = [[int(c) if c.isdigit() else c for c in line] for line in data]
    # solve_first_puzzle(data)
    solve_second_puzzle(data)
