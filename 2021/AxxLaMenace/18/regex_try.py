
def add(a, b):
    return f'[{a}, {b}]'

def check_explosion(s):
    count = 0
    for i in s:
        if s[i] == '[': count += 1
        if s[i] == ']': count -= 1
        if count == 5:
            index_right = s.find(']', i)


# if __name__ == '__main__':
#     with open("18/data.txt") as f:
#         # data = [json.loads(line) for line in f.read().splitlines()]
#         data = f.read().splitlines()
#     print(data)

# print(add('[1,2]','[[3,4],5]'))

# print(int('['))
import re
xx = "a guru99,education is fun"
# r1 = re.search(r"^\w+",xx)
# print(r1)

# rules = re.findall(r'(\w+) -> (\w+)', 'FH -> P')
# print('rules', rules)

with open('13/data.txt') as f:
    points, folds = f.read().split('\n\n')

# points = re.findall(r'\[(\d+),(\d+)\]', 'a28 [10,1] [2,2] A28')
# # points = {(int(x), int(y)) for x, y in points}
# # folds = re.findall(r'fold along ([xy])=(\d+)', folds)
# # folds = [(axis, int(coordinate)) for axis, coordinate in folds]
# print('points', points)
# # print('folds', folds)
# match = re.search(r'\[(\d+),(\d+)\]', 'a28 [10,1] [2,2] A28')
# print(match)
# print(match.group(0))
# print(points)

# s = '[[10,1],[2,2]]'
# print(re.findall(r'\[(\d+),(\d+)\]', s))
# print(re.findall(r'\[(\d+),(\d+)\]', s))
# print(re.search(r'\[(\d+),(\d+)\]', s))

s = '[[[[2,2],[9,5]],[0,[1,0]]],[4,[[2,4],4]]]'
# res = re.findall(r'(\d+)[\[\]]*,[\[\]]*\[(\d+),(\d+)\][\[\]]*,[\[\]]*(\d+)', s)
# print(res)
# print(re.search(r'(\d+)[\[\]]*,[\[\]]*\[(\d+),(\d+)\][\[\]]*,[\[\]]*(\d+)', s))

s = '[7,[[8,4],9]]'
match = re.search(r'\[(\d+),(\d+)\]', s)
print(match.group(0))

match2 = re.search(f'{match.group(0)},(\d+)', s)
print(match2)

print(re.search(r'\d+', '[85,[68'[::-1]))