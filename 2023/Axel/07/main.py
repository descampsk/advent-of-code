from os.path import join, dirname
from collections import Counter


def get_power(hand):
    c = tuple(sorted(Counter(hand).values(), reverse=True))
    return {
        (5,): 7,
        (4, 1): 6,
        (3, 2): 5,
        (3, 1, 1): 4,
        (2, 2, 1): 3,
        (2, 1, 1, 1): 2,
    }.get(c, 1)


def solve(data, joker=False):
    items = []
    for hand, bid in data:
        if not joker:
            order = "23456789TJQKA"
            power = get_power(hand)
        else:
            order = "J23456789TQKA"
            power = max(get_power(hand.replace("J", elem)) for elem in order)
        new_hand = list(map(lambda x: order.index(x), hand))
        items.append((power, new_hand, int(bid)))
    items.sort()
    return sum((i + 1) * v[2] for i, v in enumerate(items))


with open(join(dirname(__file__), "data.txt")) as f:
    data = [line.split() for line in f.read().splitlines()]


print("PART_1", solve(data))
print("PART_2", solve(data, joker=True))
