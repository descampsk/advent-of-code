def solve_puzzle(data, slide=1):
    count = 0
    for i in range(1, len(data)):
        if data[i] > data[i - slide]: count += 1
    return count

if __name__ == '__main__':
    file = open("01/data.txt", "r")
    data = [int(elem) for elem in file.read().split('\n')]
    print("result first puzzle:", solve_puzzle(data))
    print("result second puzzle:", solve_puzzle(data, 3))
    file.close()
