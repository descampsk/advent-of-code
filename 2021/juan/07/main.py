import data


crabPositions = data.crabPositions


def fuelConsumptionBetweenTwoPositionsPartOne(posOne, posTwo):
    return abs(posOne - posTwo)


def getSmallerValueFromDict(fuelConsumption):
    return min(fuelConsumption.items(), key=lambda x: x[1])


def fuelConsumptionBetweenTwoPositionsPartTwo(posOne, posTwo):
    minPos = min(posOne, posTwo)
    maxPos = max(posOne, posTwo)

    return int(((maxPos - minPos)**2 + maxPos - minPos) / 2)


def partOneAndTwo(crabPositions, fuelConsumptionMethod):
    fuelConsumption = {}

    minPos = min(crabPositions)
    maxPos = max(crabPositions)

    for position in range(minPos, maxPos + 1):
        fuelConsumption[position] = 0

        for crab in crabPositions:
            fuelConsumption[position] += fuelConsumptionMethod(position, crab)
    
    return fuelConsumption


fuelConsumptionPartOne = partOneAndTwo(crabPositions, fuelConsumptionBetweenTwoPositionsPartOne)
partOneSmallerValue = getSmallerValueFromDict(fuelConsumptionPartOne)
print(f"PART ONE : Best position is {partOneSmallerValue[0]} with fuel consumption at {partOneSmallerValue[1]}")

fuelConsumptionPartTwo = partOneAndTwo(crabPositions, fuelConsumptionBetweenTwoPositionsPartTwo)
partTwoSmallerValue = getSmallerValueFromDict(fuelConsumptionPartTwo)
print(f"PART TWO : Best position is {partTwoSmallerValue[0]} with fuel consumption at {partTwoSmallerValue[1]}")


