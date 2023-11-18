def solve_puzzle(lines, puzzle=1):
    hori = depth = aim = 0
    for line in lines:
        dir, value = line.split(" ")
        value = int(value)
        if puzzle == 1:
            if dir == "forward": hori += value
            elif dir == "down": depth += value
            elif dir == "up": depth -= value
        else:
            if dir == "forward": hori += value; depth += value*aim
            elif dir == "down": aim += value
            elif dir == "up": aim -= value
    return hori * depth

if __name__ == '__main__':
    file = open("02/data.txt", "r")
    lines = file.read().split('\n')
    print("result first puzzle:", solve_puzzle(lines))
    print("result second puzzle:", solve_puzzle(lines, puzzle=2))
    file.close()
