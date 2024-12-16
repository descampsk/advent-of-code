from os.path import join, dirname
from collections import defaultdict


def is_right_update(update, rules):
    for index, num in enumerate(update):
        for num2 in update[:index]:
            if num2 in rules[num]:
                return False
    return True


def fix_update(update, rules):
    corrected = update.copy()
    index = 1
    while index < len(update):
        num = corrected[index]
        index2 = 0
        while index2 < index:
            num2 = corrected[index2]
            if num2 in rules[num]:
                corrected.pop(index2)
                corrected.insert(index, num2)
                index -= 1
            else:
                index2 += 1
        index += 1
    return corrected


def part_1(rules, updates):
    total = 0
    for update in updates:
        if is_right_update(update, rules):
            total += update[len(update) // 2]
    return total


def part_2(rules, updates):
    total = 0
    for update in updates:
        if not is_right_update(update, rules):
            corrected = fix_update(update, rules)
            total += corrected[len(corrected) // 2]
    return total


with open(join(dirname(__file__), "data.txt")) as f:
    blocks = f.read().split("\n\n")
rulesData = [list(map(int, row.split("|"))) for row in blocks[0].splitlines()]
updates = [list(map(int, row.split(","))) for row in blocks[1].splitlines()]

rules = defaultdict(list)
for rule in rulesData:
    rules[rule[0]].append(rule[1])

print(part_1(rules, updates))
print(part_2(rules, updates))
