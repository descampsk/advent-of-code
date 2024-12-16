from os.path import join, dirname
import re


def deep_1(test, total, nums):
    if len(nums) == 0:
        return total == test
    if total > test:
        return False
    return deep_1(test, total + nums[0], nums[1:]) or deep_1(
        test, total * nums[0], nums[1:]
    )


def op_or(a, b):
    return int(str(a) + str(b))


def deep_2(test, total, nums):
    if len(nums) == 0:
        return total == test
    if total > test:
        return False
    return (
        deep_2(test, total + nums[0], nums[1:])
        or deep_2(test, total * nums[0], nums[1:])
        or deep_2(test, op_or(total, nums[0]), nums[1:])
    )


def search(rows, deep):
    calibration = 0
    for row in rows:
        is_valid = deep(row[0], row[1], row[2:])
        print(row, is_valid)
        if is_valid:
            calibration += row[0]
    return calibration


with open(join(dirname(__file__), "data.txt")) as f:
    data = [list(map(int, re.findall(r"\d+", row))) for row in f.read().splitlines()]

print(search(data, deep_1))
print(search(data, deep_2))
