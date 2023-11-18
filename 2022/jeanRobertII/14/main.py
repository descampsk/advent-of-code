import json

file = open('./data.json')
rockPaths = json.load(file)


def displayGrid(grid):
    for row in grid:
        print(row)


def getGridBoundaries(rockPaths):
    X_MIN, X_MAX = 999999, 0
    Y_MIN, Y_MAX = 999999, 0

    for rockPath in rockPaths:
        rockPath = [list(map(int, i.split(",")))
                    for i in rockPath.split(" -> ")]

        for rockCoordinate in rockPath:
            if rockCoordinate[0] > X_MAX:
                X_MAX = rockCoordinate[0]

            if rockCoordinate[0] < X_MIN:
                X_MIN = rockCoordinate[0]

            if rockCoordinate[1] > Y_MAX:
                Y_MAX = rockCoordinate[1]

            if rockCoordinate[1] < Y_MIN:
                Y_MIN = rockCoordinate[1]

    return X_MIN, X_MAX, Y_MIN, Y_MAX


def drawWallOnGrid(caveWallGrid, rockPaths, X_MIN):
    for rockPath in rockPaths:
        rockPath = [list(map(int, i.split(",")))
                    for i in rockPath.split(" -> ")]

        for index in range(len(rockPath) - 1):
            startCoordinates, targetCoordinates = rockPath[index], rockPath[index+1]

            # Draw Y
            if startCoordinates[0] == targetCoordinates[0]:
                baseX = startCoordinates[0] - X_MIN
                yStart = min(startCoordinates[1], targetCoordinates[1])
                yEnd = max(startCoordinates[1], targetCoordinates[1])

                for yCoordinate in range(yStart, yEnd+1):
                    caveWallGrid[yCoordinate][baseX] = "#"

            # Draw X
            if startCoordinates[1] == targetCoordinates[1]:
                baseY = startCoordinates[1]
                xStart = min(startCoordinates[0], targetCoordinates[0]) - X_MIN
                xEnd = max(startCoordinates[0], targetCoordinates[0]) - X_MIN

                for xCoordinate in range(xStart, xEnd+1):
                    caveWallGrid[baseY][xCoordinate] = "#"

    # Draw floor
    for xIndex in range(len(caveWallGrid[-1])):
        caveWallGrid[-1][xIndex] = "#"

    return caveWallGrid


def canGoDown(caveWallGrid, sandXIndex, sandYIndex):
    return caveWallGrid[sandYIndex + 1][sandXIndex] == '.'


def canGoDownLeft(caveWallGrid, sandXIndex, sandYIndex):
    return caveWallGrid[sandYIndex + 1][sandXIndex - 1] == '.'


def canGoDownRight(caveWallGrid, sandXIndex, sandYIndex):
    return caveWallGrid[sandYIndex + 1][sandXIndex + 1] == '.'


X_MIN, X_MAX, Y_MIN, Y_MAX = getGridBoundaries(rockPaths)

caveWallGrid = [
    ["."] * (X_MAX - X_MIN + 1) for _ in range(Y_MAX + 3)]


caveWallGrid = drawWallOnGrid(caveWallGrid, rockPaths, X_MIN)


X_SAND = 500 - X_MIN
Y_SAND = 0
sandCount = 0

while True:
    sandCount += 1

    sandXIndex = X_SAND
    sandYIndex = Y_SAND

    isAir = canGoDown(caveWallGrid, sandXIndex, sandYIndex - 1)
    while isAir:
        if sandXIndex == 0:
            for row in caveWallGrid:
                row.insert(0, ".")
                row.insert(0, ".")

            caveWallGrid[-1][0] = "#"
            caveWallGrid[-1][1] = "#"

            X_SAND += 2
            sandXIndex += 2
        if sandXIndex == len(caveWallGrid[0]) - 1:
            for row in caveWallGrid:
                row.append(".")
                row.append(".")

            caveWallGrid[-1][-1] = "#"
            caveWallGrid[-1][-2] = "#"

        if canGoDown(caveWallGrid, sandXIndex, sandYIndex):
            sandYIndex = sandYIndex + 1
            isAir = True
            continue

        if canGoDownLeft(caveWallGrid, sandXIndex, sandYIndex):
            sandXIndex = sandXIndex - 1
            sandYIndex = sandYIndex + 1
            isAir = True
            continue

        if canGoDownRight(caveWallGrid, sandXIndex, sandYIndex):
            sandXIndex = sandXIndex + 1
            sandYIndex = sandYIndex + 1
            isAir = True
            continue

        isAir = False

    caveWallGrid[sandYIndex][sandXIndex] = 'o'

    if not canGoDown(caveWallGrid, X_SAND, Y_SAND - 1):
        print(f"Cannot create new sand at {X_SAND, Y_SAND}")
        break


print(sandCount)
