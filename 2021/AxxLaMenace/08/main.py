# PART 1
def solve_first_puzzle(lines):
    outputs = [lines[i].split(' | ')[1] for i in range(len(lines))]
    return sum(sum([1 for elem in output.split() if len(elem) in [2,3,4,7]]) for output in outputs)

# PART 2
def nb_common_letters(word1, word2):
    return len(set(word1).intersection(word2))

def class_words_by_length(words):
    return {length: [w for w in words if len(w) == length] for length in {len(w) for w in words}}

def create_dict_permutations(words_by_length):
    d = {}
    d['1'] = words_by_length[2][0]
    d['7'] = words_by_length[3][0]
    d['4'] = words_by_length[4][0]
    d['8'] = words_by_length[7][0]
    d['3'] = [word for word in words_by_length[5] if (nb_common_letters(word, d['1']) == 2)][0]
    d['2'] = [word for word in words_by_length[5] if (nb_common_letters(word, d['4']) == 2)][0]
    d['5'] = [word for word in words_by_length[5] if word not in [d['2'], d['3']]][0]
    d['6'] = [word for word in words_by_length[6] if (nb_common_letters(word, d['1']) == 1)][0]
    d['9'] = [word for word in words_by_length[6] if (nb_common_letters(word, d['4']) == 4)][0]
    d['0'] = [word for word in words_by_length[6] if word not in [d['6'], d['9']]][0]
    return d

def solve_second_puzzle(lines):
    sum = 0
    for line in lines:
        input, output = line.split(' | ')
        dict_permutations = create_dict_permutations(class_words_by_length(input.split()))
        inv_map = {''.join(sorted(v)): k for k, v in dict_permutations.items()}
        sum += int("".join([inv_map[''.join(sorted(word))] for word in output.split()]))
    return sum

if __name__ == '__main__':
    file = open("08/data.txt", "r")
    lines = file.read().split('\n')
    print("result first puzzle:", solve_first_puzzle(lines))
    print("result second puzzle:", solve_second_puzzle(lines))
    file.close()

"""
Explication part 2

1) pour les digits faciles (1,4,7,8), on regarde le nombre de segments (par ex, 1=bc, 7=bgc, 4=abec, 8=bcadegf)
2) Pour les trois digits qui ont 5 segments (les digits 2,3,5):
    - le digit 3 a deux segments en commun avec le digit 1
    - le digit 2 a deux segments en commun avec le digit 4
    - le digit 5 est celui qui reste
3) Pour les trois digits qui ont 6 segments (les digits 6,9,0):
    - le digit 6 a un segment en commun avec le digit 1
    - le digit 9 a 4 segments en commun avec le digit 4
    - le digit 0 est celui qui reste
"""