# Inspired by the great AxxLaMenace

import data


lines = data.lines

""" PART ONE """

def createGrid(length):
    return [[0 for x in range(length)] for y in range(length)]


def getLineCoordinates(coordinates):
    xMin = min(coordinates[0], coordinates[2])
    xMax = max(coordinates[0], coordinates[2])
    yMin = min(coordinates[1], coordinates[3])
    yMax = max(coordinates[1], coordinates[3])

    # Vertical
    if xMin == xMax:
        return [[xMin, y] for y in range(yMin, yMax + 1)]

    # Horizontal
    if yMin == yMax:
        return [[x, yMin] for x in range(xMin, xMax + 1)]
    
    return []
    

def partOne(lines):
    grid = createGrid(1000)
    count = 0

    for line in lines:
        lineCoordinates = getLineCoordinates(line)

        for coordinate in lineCoordinates:
            xCoordinate = coordinate[0]
            yCoordinate = coordinate[1]
            grid[yCoordinate][xCoordinate] += 1

            if (grid[yCoordinate][xCoordinate] == 2):
                count += 1

    return count


print(f"Overlapping vents: {partOne(lines)}")