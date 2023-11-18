import json
import re


fileTerminal = open('./data.json')
terminal = json.load(fileTerminal)

TOTAL_DISK_SPACE = 70000000
MINIMAL_UNUSED_SPACE = 30000000


def isChangeDirectory(line: str) -> bool:
    return line.startswith("$ cd")


def isBackToParentFolder(line: str) -> bool:
    return line == "$ cd .."


def getFolderName(line: str) -> str:
    return line.split(" ")[2]


directories = {}
parents = []
for line in terminal:
    # Delete last parent from parents array if "$ cd .."
    if isBackToParentFolder(line):
        parents.pop()

    # Add folder name to parents if "$ cd"
    elif isChangeDirectory(line):
        folder = getFolderName(line)
        pathName = "_".join(parents) + folder
        parents.append(pathName)

    # Current line is file details => add size to all parents
    if re.search('^\s*[0-9]', line):
        fileSize = line.split(" ")[0]
        for parent in parents:
            if not parent in directories:
                directories[parent] = int(fileSize)
            else:
                directories[parent] += int(fileSize)


totalOccupiedSpace = directories["/"]
totalUnder100K = 0
for key, value in directories.items():
    if value <= 100000:
        totalUnder100K += value


print("Part one answer:", totalUnder100K)


unuseSpace = TOTAL_DISK_SPACE - totalOccupiedSpace
requiredSpace = MINIMAL_UNUSED_SPACE - unuseSpace
print("totalOccupiedSpace", totalOccupiedSpace)
print("unuseSpace", unuseSpace)
print("requiredSpace", requiredSpace)

directoriesWithEnoughSpaces = []

for key, value in directories.items():
    if value >= requiredSpace:
        directoriesWithEnoughSpaces.append(value)

sortedDirectoriesWithEnoughSpaces = sorted(directoriesWithEnoughSpaces)
print(sortedDirectoriesWithEnoughSpaces[0])
