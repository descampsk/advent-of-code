import json

fileStacks = open('./data.json')
stacks = json.load(fileStacks)
fileMoves = open('./dataMoves.json')
moves = json.load(fileMoves)


def moveCrateToStack(stacks, sourceStackIndex, targetStackIndex):
    crate = stacks[sourceStackIndex - 1][0]
    print(f"\t> Moving {crate}: {sourceStackIndex} --> {targetStackIndex}")
    stacks[sourceStackIndex - 1] = stacks[sourceStackIndex - 1][1:]
    stacks[targetStackIndex - 1].insert(0, crate)

    return stacks


def moveMultipleCratesToStack(stacks, sourceStackIndex, targetStackIndex, crateQuantity):
    crates = stacks[sourceStackIndex - 1][0:crateQuantity]
    print(
        f"\t> Moving {[crate for crate in crates]}: {sourceStackIndex} --> {targetStackIndex}")
    stacks[sourceStackIndex - 1] = stacks[sourceStackIndex - 1][len(crates):]
    stacks[targetStackIndex - 1] = crates + stacks[targetStackIndex - 1]

    return stacks


def getStacksLetters(stacks):
    result = ""
    for stack in stacks:
        if (len(stack)):
            result += stack[0]

    return result


# PART ONE
""" for move in moves:
    print(f"Move {move[0]} crate(s) from stack {move[1]} to stack {move[2]}")
    crateMoves, sourceStackIndex, targetStackIndex = move

    for crateMove in range(crateMoves):
        stacks = moveCrateToStack(stacks, sourceStackIndex, targetStackIndex)

lettersOne = getStacksLetters(stacks)
print(lettersOne) """


# PART TWO
for move in moves:
    print(f"Move {move[0]} crate(s) from stack {move[1]} to stack {move[2]}")
    crateMoves, sourceStackIndex, targetStackIndex = move

    stacks = moveMultipleCratesToStack(
        stacks, sourceStackIndex, targetStackIndex, crateMoves)

lettersTwo = getStacksLetters(stacks)
print(lettersTwo)
