from collections import Counter

# PART 1
def solve_first_puzzle(lines):
    outputs = [lines[i].split(' | ')[1] for i in range(len(lines))]
    return sum(sum([1 for elem in output.split() if len(elem) in [2,3,4,7]]) for output in outputs)

# PART 2
def find_element_by_occurences(dict, occur):
    return [key for key, val in dict.items() if (val == occur and key != " ")][0]

def find_word_by_length(words, length):
    matches = [word for word in words if len(word) == length]
    if len(matches) != 1:
        raise ValueError(f'problem in match find_word_by_length {words} {length}')
    return matches[0]

def deduce_letter_from_letter_founds(letters_already_founds, new_letters):
    matches = [new_letter for new_letter in new_letters if new_letter not in letters_already_founds]
    if len(matches) != 1:
        raise ValueError(f'problem in match deduce_letter_from_letter_founds {letters_already_founds} {new_letters}')
    return matches[0]

def find_permutations(input):
    """ We use notations North, South, West, East, and Central for digits segments """
    counter = Counter(input)
    words = input.split()
    SW = find_element_by_occurences(counter, 4)
    NW = find_element_by_occurences(counter, 6)
    SE = find_element_by_occurences(counter, 9)
    NE = deduce_letter_from_letter_founds([SE], find_word_by_length(words, 2))
    N = deduce_letter_from_letter_founds([NE,SE], find_word_by_length(words, 3))
    C = deduce_letter_from_letter_founds([NW,NE,SE], find_word_by_length(words, 4))
    S = deduce_letter_from_letter_founds([N,NW,NE,C,SW,SE], find_word_by_length(words, 7))
    return {'SW':SW,'NW':NW,'SE':SE,'NE':NE,'N':N,'C':C,'S':S}

def find_number_from_word(word, p): # p : permutations
    if len(word) == 2:
        return '1'
    elif len(word) == 3:
        return '7'
    elif len(word) == 4:
        return '4'
    elif len(word) == 7:
        return '8'
    elif len(word) == 5:
        if p['SE'] not in word:
            return '2'
        elif p['NE'] not in word:
            return '5'
        else:
            return '3'
    elif len(word) == 6:
        if p['C'] not in word:
            return '0'
        elif p['NE'] not in word:
            return '6'
        else:
            return '9'
    else:
        raise ValueError(f'problem in find_number_from_word {word} {p}')

def format_number(output_string, permutations):
    numbers = [find_number_from_word(word, permutations) for word in output_string.split()]
    return int("".join(numbers))

def solve_second_puzzle(lines):
    sum = 0
    for line in lines:
        input, output = line.split(' | ')
        permutations = find_permutations(input)
        sum += format_number(output, permutations)
    return sum

if __name__ == '__main__':
    file = open("08/data.txt", "r")
    lines = file.read().split('\n')
    print("result first puzzle:", solve_first_puzzle(lines))
    print("result second puzzle:", solve_second_puzzle(lines))
    file.close()

"""
IDEES ET STRATEGIES

nb segments : numbers
2: 1
3: 7
4: 4
5: 2,3,5
6: 0,6,9
7: 8

1ère idée abandonnée : représentation binaire d'un nombre avec leds allumées ou éteinte : 0010010 : pour le chiffre 1 avec 2 leds c et f allumées

stratégie: (North, East, South, West, Central)

LEDs / nombre de présences parmi tous les digits:
SW: 4
NW: 6
C: 7
S: 7
N: 8
NE: 8
SE: 9
On trouve tout de suite SW, NW et SE

Avec le digit 1 qui a 2 segments (NE, SE), on en déduit NE
En comparant avec le digit 7 qui a 3 segments (NE, SE, N), on en déduit N
Avec le digit 4 qui a 4 segments (NW, C, NE, SE), on en déduit C
Puis il reste plus que S à déduire

"""