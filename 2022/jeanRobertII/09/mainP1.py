import json

file = open('./data.json')
hMoves = json.load(file)

print(hMoves)


def isHOverlappingT(tPosition, hPosition):
    return hPosition == tPosition


def isTOnSameRowOrColumn(tPosition, hPosition):
    return tPosition[0] == hPosition[0] or tPosition[1] == hPosition[1]


def isTOneCaseAwayFromHOnSameRowOrCol(tPosition, hPosition):
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


def isTAdjacentOfH(tPosition, hPosition):
    return isTOneCaseAwayFromHOnSameRowOrCol(tPosition, hPosition) or isTDiagonalToH(tPosition, hPosition) or isHOverlappingT(tPosition, hPosition)


def moveRight(initialPosition):
    return (initialPosition[0] + 1, initialPosition[1])


def moveUp(initialPosition):
    return (initialPosition[0], initialPosition[1] + 1)


def moveLeft(initialPosition):
    return (initialPosition[0] - 1, initialPosition[1])


def moveDown(initialPosition):
    return (initialPosition[0], initialPosition[1] - 1)


hPosition = (0, 0)
tPosition = (0, 0)

tVisited = {"0,0": (0, 0)}

for move in hMoves:
    direction, steps = move.split()

    for step in range(int(steps)):
        print(f"{direction} -> {step}/{steps}")

        moveFunction = None
        if direction == "R":
            moveFunction = moveRight
        elif direction == "U":
            moveFunction = moveUp
        elif direction == "L":
            moveFunction = moveLeft
        elif direction == "D":
            moveFunction = moveDown

        hPosition = moveFunction(hPosition)

        if isTAdjacentOfH(tPosition, hPosition):
            print({"hPosition": hPosition, "tPosition": tPosition})
            continue
        elif not isTAdjacentOfH(tPosition, hPosition) and isTOnSameRowOrColumn(tPosition, hPosition):
            tPosition = moveFunction(tPosition)

            tVisited[f"{tPosition[0]},{tPosition[1]}"] = tPosition
        else:
            tPosition = moveFunction(tPosition)

            if direction == "R" and tPosition[1] > hPosition[1]:
                tPosition = moveDown(tPosition)
            if direction == "R" and tPosition[1] < hPosition[1]:
                tPosition = moveUp(tPosition)
            if direction == "U" and tPosition[0] > hPosition[0]:
                tPosition = moveLeft(tPosition)
            if direction == "U" and tPosition[0] < hPosition[0]:
                tPosition = moveRight(tPosition)
            if direction == "L" and tPosition[1] > hPosition[1]:
                tPosition = moveDown(tPosition)
            if direction == "L" and tPosition[1] < hPosition[1]:
                tPosition = moveUp(tPosition)
            if direction == "D" and tPosition[0] > hPosition[0]:
                tPosition = moveLeft(tPosition)
            if direction == "D" and tPosition[0] < hPosition[0]:
                tPosition = moveRight(tPosition)

            tVisited[f"{tPosition[0]},{tPosition[1]}"] = tPosition

        print({"hPosition": hPosition, "tPosition": tPosition})

# print(tVisited)
print(len(tVisited))
