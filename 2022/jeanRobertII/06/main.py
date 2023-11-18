import json
from collections import Counter


fileDatastream = open('./data.json')
datastream = json.load(fileDatastream)[0]

MARKER_SIZE = 4
MESSAGE_SIZE = 14


def isUniqueChars(chars: str) -> bool:
    freq = Counter(chars)

    return len(freq) == len(chars)


markerIndex = -1
for charIndex in range(MARKER_SIZE, len(datastream) + 1):
    currentChars = datastream[charIndex-MARKER_SIZE:charIndex]

    if isUniqueChars(currentChars):
        markerIndex = charIndex
        break

messageIndex = -1
for charIndex in range(MESSAGE_SIZE, len(datastream) + 1):
    currentChars = datastream[charIndex-MESSAGE_SIZE:charIndex]

    if isUniqueChars(currentChars):
        messageIndex = charIndex
        break


print("markerIndex", markerIndex)
print("messageIndex", messageIndex)
