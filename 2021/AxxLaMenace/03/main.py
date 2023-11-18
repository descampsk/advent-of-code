
def solve_first_puzzle(lines):
    counter = [sum([int(line[i]) for line in lines]) for i in range(len(lines[0]))]
    gamma = "".join(["1" if c > len(lines)/2 else "0" for c in counter ])
    epsilon = ''.join([{ '0':'1', '1':'0'}[c] for c in gamma])
    return int(gamma, 2)*int(epsilon, 2)

def compute_rating(lines_left, bin):
    index = 0
    while (index <= len(lines[0]) and len(lines_left) > 1):
        counter = sum([int(line[index]) for line in lines_left])
        num_to_keep = bin if counter >= len(lines_left)/2 else str(1-int(bin))
        lines_left = [line for line in lines_left if line[index]==num_to_keep]
        index += 1
    return int(lines_left[0], 2)

def solve_second_puzzle(lines):
    oxygen = compute_rating(lines[:], '1')
    co2 = compute_rating(lines[:], '0')
    return oxygen*co2

if __name__ == '__main__':
    file = open("03/data.txt", "r")
    lines = file.read().split('\n')
    print("result first puzzle:", solve_first_puzzle(lines))
    print("result second puzzle:", solve_second_puzzle(lines))
    file.close()
