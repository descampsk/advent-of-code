import json
import string

file = open('./data.json')
backpacks = json.load(file)

lowercaseAndUppercaseLetters = string.ascii_letters


def getLetterValue(letter: string) -> int:
    return lowercaseAndUppercaseLetters.index(letter) + 1


# PART ONE
countOne = 0
for backpack in backpacks:

    firstHalf, secondHalf = backpack[:len(
        backpack)//2], backpack[len(backpack)//2:]

    intersection = "".join(list(set(firstHalf) & set(secondHalf)))

    letterValue = getLetterValue(intersection)

    countOne += letterValue

print(countOne)


# PART TWO
countTwo = 0
for groupIndex in range(0, len(backpacks), 3):
    elfOne, elfTwo, elfThree = backpacks[groupIndex], backpacks[groupIndex +
                                                                1], backpacks[groupIndex + 2]

    intersection = "".join(list(set(elfOne) & set(elfTwo) & set(elfThree)))
    letterValue = getLetterValue(intersection)

    countTwo += letterValue

print(countTwo)
