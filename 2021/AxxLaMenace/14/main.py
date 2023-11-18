from collections import Counter, defaultdict

def step(occurences, rules):
    occurences_add = defaultdict(int)
    occurences_reset = defaultdict(int)
    for duo in rules:
        a,b = duo
        c = rules[duo]
        val = occurences[duo]
        occurences_reset[duo] = 0
        occurences_add[a+c] += val
        occurences_add[c+b] += val
    return defaultdict(int, Counter({**occurences, **occurences_reset}) + Counter(occurences_add))

def get_letter_counts(occurences, start, end):
    d = defaultdict(int)
    d[start] = d[end] = 1
    for duo, num in occurences.items():
        for letter in duo:
            d[letter] += num
    d = { letter: num//2 for letter, num in d.items()}
    return d

def solve_puzzle(s, rules, steps):
    occurences = defaultdict(int, { s[i]+s[i+1]: s.count(s[i]+s[i+1]) for i in range(0, len(s)-1)})
    for _ in range(steps):
        occurences = step(occurences, rules)
    counts = get_letter_counts(occurences, s[0], s[-1])
    return max(counts.values()) - min(counts.values())

if __name__ == '__main__':
    with open("14/data.txt") as f:
        blocks = f.read().split('\n\n')
        template = blocks[0]
        rules = { asso[0]: asso[1] for asso in [line.split(' -> ') for line in blocks[1].split('\n')]}
        print("result first puzzle:", solve_puzzle(template, rules, 10))
        print("result second puzzle:", solve_puzzle(template, rules, 40))
