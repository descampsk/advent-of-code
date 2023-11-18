import json

file = open('./data.json')
rounds = json.load(file)


cryptedShapeToCurratedShapeMapper = {
    "A": "R",
    "B": "P",
    "C": "S",
}

shapeValueMapper = {
    "R": 1,
    "P": 2,
    "S": 3,
}

shapeMapper = {
    "R": {"X": "S", "Y": "R", "Z": "P"},
    "P": {"X": "R", "Y": "P", "Z": "S"},
    "S": {"X": "P", "Y": "S", "Z": "R"},
}

outcomeMapper = {
    "X": 0,
    "Y": 3,
    "Z": 6,
}


def getCurratedShapeFromEntry(entry: str) -> str:
    return cryptedShapeToCurratedShapeMapper[entry]


def getPlayerHandFromAdversaryHandAndOutcome(adversaryHand: str, outcome: str) -> str:
    return shapeMapper[adversaryHand][outcome]


def getPlayerHandValue(playerHand: str) -> str:
    return shapeValueMapper[playerHand]


def getOutcomeValue(outcome: str) -> str:
    return outcomeMapper[outcome]


playerCount = 0
for round in rounds:
    [adversaryHand, outcome] = round
    adversaryCurratedHand = getCurratedShapeFromEntry(adversaryHand)

    playerHand = getPlayerHandFromAdversaryHandAndOutcome(
        adversaryCurratedHand, outcome)

    roundValue = getPlayerHandValue(playerHand)
    roundValue += getOutcomeValue(outcome)
    playerCount += roundValue


print(playerCount)
