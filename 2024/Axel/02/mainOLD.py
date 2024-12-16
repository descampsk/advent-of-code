from os.path import join, dirname


def nb_errors(row):
    i = 1
    errors = 0
    prev = row[0]
    increase = 0
    decrease = 0
    while i < len(row):
        diff = abs(row[i] - prev)
        if diff > 3 or diff < 1:
            errors += 1
        elif row[i] > prev:
            increase += 1
            prev = row[i]
        elif row[i] < prev:
            decrease += 1
            prev = row[i]
        i += 1
    errors += min(increase, decrease)
    return errors


def is_safe(row):
    a = nb_errors(row)
    b = nb_errors(row[1:])
    if a > 1:
        print(a, b, row)
    return a < 2 or b == 0


with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, rows.split())) for rows in f.read().splitlines()]

# for row in data:
#     print(row, is_safe(row))
result = len(list(filter(is_safe, data)))
print(result)
# print(is_safe([5, 8, 6, 4, 1]))
# print(is_safe([7, 6, 18, 18, 4, 1]))
# print(is_safe([48, 51, 52, 53, 52]))
