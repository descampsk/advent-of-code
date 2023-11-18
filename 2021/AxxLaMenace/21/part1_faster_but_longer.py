def get_turns_to_reach_score(score, pos, move):
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

with open("21/data.txt") as f:
    lines = f.read().splitlines()
starts = [int(line.split('starting position: ')[-1]) for line in lines]
first_moves = [6, 5]
goal = 1000

cadences = [get_score_from_turns(10, starts[i], first_moves[i]) for i in range(len(starts))]
winner = 0 if cadences[0] > cadences[1] else 1
loser = 1 - winner

turns_dozen = goal//cadences[winner]
rest_score_to_do = goal - turns_dozen * cadences[winner]

turns_left = get_turns_to_reach_score(rest_score_to_do, starts[0], first_moves[0])
total_turns = 10*turns_dozen + turns_left
die_rolls = 3*(total_turns*2)

if winner == 0:
    turns_left -= 1
    die_rolls -= 3
score_loser = total_turns//10 * cadences[loser] + get_score_from_turns(turns_left, starts[1], first_moves[1])
print('score_loser', score_loser)
print('die rolls', die_rolls)

print('result', score_loser * die_rolls)
