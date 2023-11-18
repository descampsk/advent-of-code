from itertools import product
from collections import defaultdict, Counter

# PART 1
def get_turns_from_score(score, pos, move):
    turn = 0
    while score > 0:
        pos = (pos - 1 + move)%10 + 1
        score -= pos
        move = (move-2)%10
        turn += 1
    return turn

def get_score_from_turns(turns, pos, move):
    score = 0
    for _ in range(turns):
        pos = (pos - 1 + move)%10 + 1
        score += pos
        move = (move-2)%10
    return score

def solve_first_puzzle(start1, start2):
    first_move = 6
    goal = 1000
    turns = get_turns_from_score(goal, start1, first_move)
    score_loser = get_score_from_turns(turns-1, start2, first_move-1)
    die_rolls = 3*(turns*2-1)
    return score_loser*die_rolls

# PART 2
def create_possible_universes_dict():
    d = defaultdict(int)
    for elem in product([1,2,3], repeat=3):
        d[sum(elem)] += 1
    return d

def increase_score(dice_result, pos, score):
    pos = (pos + dice_result)%10
    score += (pos -1)%10 +1
    return pos, score

def find(goal, combis, pos, score=0, turn=1, old_nb_universes=1):
    results=defaultdict(int)
    for dice_sum, nb_universes in combis.items():
        new_pos, new_score = increase_score(dice_sum, pos, score)
        nb_universes *= old_nb_universes
        if new_score >= goal:
            results[turn] += nb_universes
        else:
            add_dict = Counter(results) + Counter(find(goal, combis, new_pos, new_score, turn+1, nb_universes))
            results = defaultdict(int, add_dict)
    return results

def compute_victories(d1, d2):
    d1 = dict(sorted(d1.items(), key=lambda item: -item[0]))
    d2 = dict(sorted(d2.items(), key=lambda item: -item[0]))
    nb_vic = 0
    for k1 in d1:
        reduce_value = 0
        for k2 in d2:
            if k2>=k1:
                reduce_value += d2[k2]
                reduce_value //= 27
        nb_vic += reduce_value*d1[k1]
    return nb_vic

def solve_second_puzzle(start1, start2, goal):
    combis = create_possible_universes_dict()
    universes_player1 = find(goal, combis, start1)
    universes_player2 = find(goal, combis, start2)
    return compute_victories(universes_player1, universes_player2)

with open("21/data.txt") as f:
    lines = f.read().splitlines()
start1, start2 = [int(line.split('starting position: ')[-1]) for line in lines]
print('result first puzzle', solve_first_puzzle(start1, start2))
print('result second puzzle', solve_second_puzzle(start1, start2, 21))

