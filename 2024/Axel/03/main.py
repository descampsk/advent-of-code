from os.path import join, dirname
import re


def findValue(str):
    value = 0
    pattern = re.compile(r"mul\((\d+),(\d+)\)")
    for match in pattern.finditer(str):
        x, y = map(int, match.groups())
        value += x * y
    return value


def findTotal(str):
    total = findValue(str)
    pattern = re.compile(r"don't\(\)(.*?)do\(\)")
    for match in pattern.finditer(str):
        total -= findValue(match.group(0))
    return total


with open(join(dirname(__file__), "data.txt")) as f:
    row = "do()" + f.read() + "do()"
# print(findTotal(row))

a = row.split("don't()")
# print(a)
total = 0
for elem in a:
    if "do()" in elem:
        print("yo", len(elem.split("do()")))
        interesting = "".join(elem.split("do()")[1:])
        total += findValue(interesting)
print(total)

# res = re.findall(r"mul\(\d+,\d+\)", row)
# print(res)

# 71305737
# 108577143
# 153469856
# 31984974 low
# 77055967
