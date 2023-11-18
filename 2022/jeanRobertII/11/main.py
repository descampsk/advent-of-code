import json
import math

file = open('./data.json')
notes = json.load(file)

logRounds = open("logRounds.txt", "w")
logRounds.write("")
logs = open("logs.txt", "w")
logs.write("")


def multiply(baseNumber, operand):
    return baseNumber * operand


def add(baseNumber, operand):
    return baseNumber + operand


def getOperationFunction(operation: str):
    if operation == "*":
        return multiply
    elif operation == "+":
        return add


def isDivisibleBy(baseNumber, divisor):
    return baseNumber % divisor == 0


def getNextMonkey(updatedWorryLevel, divisorValue, nextMonkeyTrue, nextMonkeyFalse):
    if isDivisibleBy(updatedWorryLevel, divisorValue):
        logs.writelines(
            f"\t\t\tCurrent worry level is divisible {divisorValue}.\n")
        return nextMonkeyTrue

    logs.writelines(
        f"\t\t\tCurrent worry level is not divisible by {divisorValue}.\n")

    return nextMonkeyFalse


monkeyInpections = {}
for monkey in notes.keys():
    monkeyInpections[monkey] = 0

for round in range(1, 10001):
    print(f"Round{round}")
    logs.writelines(f"Round{round}\n")

    for key, value in notes.items():
        logs.writelines(f"\t{key}\n")

        divisorValue = int(value["Test"].split()[-1])
        nextMonkeyTrue = value["If true"].split()[-1]
        nextMonkeyFalse = value["If false"].split()[-1]

        for item in value["Starting items"]:
            logs.writelines(
                f"\t\tMonkey inspects an item with a worry level of {item}\n")

            monkeyInpections[key] += 1

            new, equal, old, operation, operationValue = value["Operation"].split(
            )
            if operationValue == "old":
                operationValue = item
            else:
                operationValue = int(operationValue)

            operationFunction = getOperationFunction(operation)

            worryLevel = operationFunction(item, operationValue)

            logs.writelines(
                f"\t\t\tWorry level is {operation} by {operationValue} to {worryLevel}\n")

            # updatedWorryLevel = math.floor(worryLevel / 3)
            updatedWorryLevel = worryLevel

            logs.writelines(
                f"\t\t\tMonkey gets bored with item. Worry level is divided by 3 to {updatedWorryLevel}.\n")

            nextMonkey = getNextMonkey(
                updatedWorryLevel, divisorValue, nextMonkeyTrue, nextMonkeyFalse)

            notes[f"Monkey {nextMonkey}"]["Starting items"].append(
                updatedWorryLevel)

            logs.writelines(
                f"\t\t\tItem with worry level {updatedWorryLevel} is thrown to monkey {nextMonkey}.\n")

        value["Starting items"] = []

    logRounds.writelines(
        f"After round {round}, the monkeys are holding items with these worry levels:\n")

    for key, value in notes.items():
        logRounds.writelines(
            f"{key}: {value['Starting items']}\n")


monkeyInpectionsList = sorted([i for i in monkeyInpections.values()])
mostActiveMonkey = monkeyInpectionsList.pop()
secondMostActiveMonkey = monkeyInpectionsList.pop()


print(mostActiveMonkey * secondMostActiveMonkey)
