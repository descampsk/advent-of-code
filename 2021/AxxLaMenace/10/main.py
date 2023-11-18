import functools
import statistics

def handle_line(line, opens, close):
    stack = []
    for char in line:
        if char in opens:
            stack.append(char)
        if char in close:
            open_char = stack.pop()
            if opens.index(open_char) != close.index(char):
                return True, False, char
    if len(stack): return False, True, stack
    return False, False, False

def point_by_char(char):
    return {')': 3, ']': 57, '}': 1197, '>': 25137}[char]

def compute_completion_string(data, opens, close):
    completion_string = ''
    for char in data:
        completion_string = close[opens.index(char)] + completion_string
    return completion_string

def compute_score_completion(completion_string):
    d = {')': 1, ']': 2, '}': 3, '>': 4}
    return functools.reduce(lambda a, b: a*5 + b, [d[char] for char in completion_string])

def find_middle(completion_points):
    return statistics.median(completion_points)

def solve_puzzle(lines):
    opens = ['(', '[', '{', '<']
    close = [')', ']', '}', '>']
    syntax_error = 0
    completion_points = []
    for line in lines:
        is_corrupted, is_incomplete, data = handle_line(line, opens, close)
        if is_corrupted:
            syntax_error += point_by_char(data)
        if is_incomplete:
            completion_string = compute_completion_string(data, opens, close)
            completion_points.append(compute_score_completion(completion_string))
    middle_score = find_middle(completion_points)
    return syntax_error, middle_score

if __name__ == '__main__':
    with open("10/data.txt") as f:
        lines = [line.strip() for line in f]
        print("result first puzzle:", solve_puzzle(lines)[0])
        print("result second puzzle:", solve_puzzle(lines)[1])
