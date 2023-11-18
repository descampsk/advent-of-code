import json
from pprint import pprint

file = open('./sampleData2.json')
hMoves = json.load(file)

print(hMoves)

logs = open("logs.txt", "w")
logs.write("")


def isHOverlappingT(tPosition, hPosition):
    return hPosition == tPosition


def isOnSameRowOrColumn(tPosition, hPosition):
    return tPosition[0] == hPosition[0] or tPosition[1] == hPosition[1]


def isTouchingLegacy(tPosition, hPosition):
    adjacentCases = [
        (hPosition[0]-1, hPosition[1]),
        (hPosition[0], hPosition[1]+1),
        (hPosition[0], hPosition[1]-1),
        (hPosition[0]+1, hPosition[1]),
    ]

    for adjacentCase in adjacentCases:
        if tPosition == adjacentCase:
            return True

    return False


def isTouching(tPosition, hPosition):
    adjacentCases = [
        (hPosition[0]-1, hPosition[1]+1),
        (hPosition[0]-1, hPosition[1]),
        (hPosition[0]-1, hPosition[1]-1),
        (hPosition[0], hPosition[1]+1),
        (hPosition[0], hPosition[1]),
        (hPosition[0], hPosition[1]-1),
        (hPosition[0]+1, hPosition[1]+1),
        (hPosition[0]+1, hPosition[1]),
        (hPosition[0]+1, hPosition[1]-1),
    ]

    for adjacentCase in adjacentCases:
        if tPosition == adjacentCase:
            return True

    return False


def isTDiagonalToH(tPosition, hPosition):
    adjacentCases = [
        (hPosition[0]-1, hPosition[1]+1),
        (hPosition[0]-1, hPosition[1]-1),
        (hPosition[0]+1, hPosition[1]+1),
        (hPosition[0]+1, hPosition[1]-1),
    ]

    for adjacentCase in adjacentCases:
        if tPosition == adjacentCase:
            return True

    return False


def isAdjacent(tPosition, hPosition):
    return isTouchingLegacy(tPosition, hPosition) or isTDiagonalToH(tPosition, hPosition) or isHOverlappingT(tPosition, hPosition)


def moveRight(initialPosition):
    return (initialPosition[0] + 1, initialPosition[1])


def moveUp(initialPosition):
    return (initialPosition[0], initialPosition[1] + 1)


def moveLeft(initialPosition):
    return (initialPosition[0] - 1, initialPosition[1])


def moveDown(initialPosition):
    return (initialPosition[0], initialPosition[1] - 1)


knotPositions = [(0, 0)] * 10
tVisited = {"(0, 0)": None}

for move in hMoves:
    direction, steps = move.split()

    for step in range(int(steps)):
        print(f"{direction} -> {step}/{steps}")
        logs.writelines(f"{direction} -> {step}/{steps}\n")

        moveFunction = None

        if direction == "R":
            moveFunction = moveRight
        elif direction == "U":
            moveFunction = moveUp
        elif direction == "L":
            moveFunction = moveLeft
        elif direction == "D":
            moveFunction = moveDown

        for index, knotPosition in enumerate(knotPositions):
            if index == 0:
                knotPositions[index] = moveFunction(knotPosition)
                logs.writelines(
                    f"\t{index} : {knotPosition} -> {knotPositions[index]}\n")

            else:
                upperKnot = knotPositions[index-1]

                if isTouching(knotPosition, upperKnot):
                    logs.writelines(
                        f"\t{index} : {knotPosition} -> {knotPositions[index]} : isTouch\n")

                    continue

                elif isOnSameRowOrColumn(knotPosition, upperKnot):
                    knotPositions[index] = moveFunction(knotPosition)

                    logs.writelines(
                        f"\t{index} : {knotPosition} -> {knotPositions[index]} : isRorC\n")

                else:
                    # T -> H
                    if upperKnot[0] > knotPositions[index][0]:
                        knotPositions[index] = moveRight(
                            knotPositions[index])

                        secondaryKnotPosition = knotPositions[index]

                        if upperKnot[1] > knotPositions[index][1]:
                            knotPositions[index] = moveUp(
                                knotPositions[index])
                        else:
                            knotPositions[index] = moveDown(
                                knotPositions[index])

                    # H <- T
                    else:
                        knotPositions[index] = moveLeft(
                            knotPositions[index])

                        secondaryKnotPosition = knotPositions[index]

                        if upperKnot[1] > knotPositions[index][1]:
                            knotPositions[index] = moveUp(
                                knotPositions[index])
                        else:
                            knotPositions[index] = moveDown(
                                knotPositions[index])

                    logs.writelines(
                        f"\t{index} : {knotPosition} -> {secondaryKnotPosition} -> {knotPositions[index]} : isDiag\n")

        tVisited[f"{knotPositions[9]}"] = knotPositions[9]
    print(knotPositions)


# print(knotPositions)
# pprint(tVisited)
print(len(tVisited))


logs.close()
