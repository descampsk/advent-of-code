import json
import string
import time

file = open('./sampleData.json')
heightMap = json.load(file)


for row in heightMap:
    print(row)

GRID_MAX_X = len(heightMap[0])
GRID_MAX_Y = len(heightMap)


letterValues = {"S": 0, "E": 27}
for index, letter in enumerate(string.ascii_lowercase):
    letterValues[letter] = index + 1


def getLetterCoordinates(grid, baseLetter):
    for rowIndex, row in enumerate(grid):
        for colIndex, letter in enumerate(row):
            if letter == baseLetter:
                return (colIndex, rowIndex)


def getNeighbouringCoordinates(xPos, yPos):
    allCoordinates = [
        (xPos-1, yPos-1),
        (xPos-1, yPos),
        (xPos-1, yPos+1),
        (xPos, yPos-1),
        (xPos, yPos+1),
        (xPos+1, yPos-1),
        (xPos+1, yPos),
        (xPos+1, yPos+1),
    ]

    if xPos == 0:
        allCoordinates = list(
            filter(lambda pos: pos[0] >= xPos, allCoordinates))

    if yPos == 0:
        allCoordinates = list(
            filter(lambda pos: pos[1] >= yPos, allCoordinates))

    if xPos == GRID_MAX_X - 1:
        allCoordinates = list(
            filter(lambda pos: pos[0] <= xPos, allCoordinates))

    if yPos == GRID_MAX_Y - 1:
        allCoordinates = list(
            filter(lambda pos: pos[1] <= yPos, allCoordinates))

    return allCoordinates


def alreadyVisited(xPos, yPos, visitedPositions):
    return len([pos for pos in visitedPositions if(pos[0] == xPos and pos[1] == yPos)]) == 1


def isEnd(xPos, yPos, endCoordinates):
    return xPos == endCoordinates[0] and yPos == endCoordinates[1]


startCoordinates = getLetterCoordinates(heightMap, "S")
endCoordinates = getLetterCoordinates(heightMap, "E")
startCoordinatesMeta = (0, startCoordinates[0], startCoordinates[1])

visitedPositions = []
positionsToVisit = [startCoordinatesMeta]
maxDistance = 0

while len(positionsToVisit) > 0:
    currentMeta = positionsToVisit.pop()
    distance, xPos, yPos = currentMeta

    if isEnd(xPos, yPos, endCoordinates):
        maxDistance = distance
        break

    currentLetter = heightMap[yPos][xPos]
    print(f"Current position: {currentMeta} -> {currentLetter}")

    visitedPositions.append((xPos, yPos))

    positionCandidates = getNeighbouringCoordinates(xPos, yPos)

    for positionCandidate in positionCandidates:
        xPosCandidate = positionCandidate[0]
        yPosCandidate = positionCandidate[1]

        if not alreadyVisited(xPosCandidate, yPosCandidate, visitedPositions):
            candidate = heightMap[positionCandidate[1]
                                  ][positionCandidate[0]]

            if letterValues[candidate] <= letterValues[currentLetter] + 1:
                positionsToVisit.append(
                    (distance + 1, positionCandidate[0], positionCandidate[1]))


print("maxDistance", maxDistance)
