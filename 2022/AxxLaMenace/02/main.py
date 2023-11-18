from os.path import join, dirname

def solve(data, puzzle=1):
    score = 0
    for move1, move2 in data:
        a = 'ABC'.index(move1)
        b = 'XYZ'.index(move2)
        if puzzle==2:
            b = (a+b-1)%3
        win_lose = 6 if b==(a+1)%3 else 3 if a==b else 0
        score += win_lose + b+1
    return score

with open(join(dirname(__file__), 'data.txt')) as f:
    data = [line.split(' ') for line in f.read().splitlines()]
print('PART_1', solve(data))
print('PART_2', solve(data, 2))
