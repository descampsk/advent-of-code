from os.path import join, dirname


def nb_errors(row):
    i = 1
    errors = 0
    increase = 0
    decrease = 0
    while i < len(row):
        diff = abs(row[i] - row[i - 1])
        if diff > 3 or diff < 1:
            errors += 1
        elif row[i] > row[i - 1]:
            increase += 1
        elif row[i] < row[i - 1]:
            decrease += 1
        i += 1
    errors += min(increase, decrease)
    return errors


def is_safe(row):
    return any(nb_errors(row[:i] + row[i + 1 :]) == 0 for i in range(len(row)))


with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, rows.split())) for rows in f.read().splitlines()]


result = len(list(filter(is_safe, data)))
print(result)
