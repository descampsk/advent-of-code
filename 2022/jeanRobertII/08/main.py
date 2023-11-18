import json

file = open('./data.json')
rawTreeHeightMap = json.load(file)


# Convert rows to int
treeHeightMap = [int(row.split()) for row in rawTreeHeightMap]


# Convert cols to int
columns = [[] for _ in range(len(treeHeightMap[0]))]
for rowIndex in range(len(treeHeightMap)):
    for colIndex in range(len(treeHeightMap[rowIndex])):
        columns[colIndex].append(int(treeHeightMap[rowIndex][colIndex]))


def isOnEdge(rowIndex: int, colIndex: int, currentRow, currentCol) -> bool:
    return rowIndex == 0 or colIndex == 0 or rowIndex == len(currentRow) - 1 or colIndex == len(currentCol) - 1


def isHighest(treeHeight: int, otherTreeHeights) -> bool:
    return max(otherTreeHeights) < treeHeight


def isVisible(treeHeight: int, leftTrees, rightTrees, topTrees, bottomTrees) -> bool:
    return isHighest(treeHeight, leftTrees) or \
        isHighest(treeHeight, rightTrees) or \
        isHighest(treeHeight, topTrees) or \
        isHighest(treeHeight, bottomTrees)


def getLowerTrees(treeHeight: int, columnOrRow) -> int:
    vision = 0

    for loopedTreeHeight in columnOrRow:
        vision += 1
        if loopedTreeHeight >= treeHeight:
            break

    return vision


def getScenicScoreByTree(treeHeight: int, leftTrees, rightTrees, topTrees, bottomTrees) -> int:
    lowerLeftTrees = getLowerTrees(treeHeight, leftTrees)
    lowerRightTrees = getLowerTrees(treeHeight, rightTrees)
    lowerTopTrees = getLowerTrees(treeHeight, topTrees)
    lowerBottomTrees = getLowerTrees(treeHeight, bottomTrees)

    return lowerLeftTrees * lowerRightTrees * lowerTopTrees * lowerBottomTrees


visibleTrees = []
scenicScores = []

for rowIndex in range(len(treeHeightMap)):
    currentRow = treeHeightMap[rowIndex]
    for colIndex in range(len(treeHeightMap[rowIndex])):
        treeHeight = treeHeightMap[rowIndex][colIndex]

        leftTrees = treeHeightMap[rowIndex][:colIndex][::-1]
        rightTrees = treeHeightMap[rowIndex][colIndex+1:]

        currentColumn = columns[colIndex]

        topTrees = currentColumn[:rowIndex][::-1]
        bottomTrees = currentColumn[rowIndex+1:]

        if isOnEdge(rowIndex, colIndex, currentRow, currentColumn):
            visibleTrees.append(
                {"pos": [colIndex, rowIndex], "value": treeHeight})

            continue

        if isVisible(treeHeight, leftTrees, rightTrees, topTrees, bottomTrees):
            visibleTrees.append(
                {"pos": [rowIndex, colIndex], "value": treeHeight})

        scenicScores.append(getScenicScoreByTree(
            treeHeight, leftTrees, rightTrees, topTrees, bottomTrees))


print(f"Part One: {len(visibleTrees) == 1794}")
print(f"Part Two: {max(scenicScores) == 199272}")
print(f"Part One: {len(visibleTrees) == 21}")
print(f"Part Two: {max(scenicScores) == 8}")
