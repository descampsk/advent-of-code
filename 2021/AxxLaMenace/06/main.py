from collections import Counter

def fishes_spawn(counter):
    spawns = counter.get(0, 0)
    counter[0] = 0
    counter[7] = counter.get(7, 0) + spawns
    counter[9] = counter.get(9, 0) + spawns
    new_counter = {k-1:v for k,v in counter.items() if k>0}
    return new_counter

def solve_puzzle(line, days):
    counter = Counter([int(item) for item in line.split(',')])
    for _ in range(days):
        counter = fishes_spawn(counter)
    return sum(counter.values())

if __name__ == '__main__':
    file = open("06/data.txt", "r")
    line = file.read()
    print("result first puzzle:", solve_puzzle(line, 80))
    print("result second puzzle:", solve_puzzle(line, 256))
    file.close()
