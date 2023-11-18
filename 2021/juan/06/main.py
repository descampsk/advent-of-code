import data
import exampleData


lanternfishes = data.lanternfishes

def computeNumberOfFishesPerDay(lanternfishes):
    numberOfFishesPerDay = [0] * 9

    for fish in lanternfishes:
        numberOfFishesPerDay[fish] += 1
    
    return numberOfFishesPerDay


def updateFishesPerDay(numberOfFishesPerDay):
    updatedFishesPerDay = [
        *numberOfFishesPerDay[1:], numberOfFishesPerDay[0]]
    
    updatedFishesPerDay[6] += numberOfFishesPerDay[0]

    return updatedFishesPerDay


def partOneAndTwo(lanternfishes, days):
    numberOfFishesPerDay = computeNumberOfFishesPerDay(lanternfishes)

    for day in range(days):
        numberOfFishesPerDay = updateFishesPerDay(numberOfFishesPerDay)
    
    return sum(numberOfFishesPerDay)


print(partOneAndTwo(lanternfishes, 80))
print(partOneAndTwo(lanternfishes, 256))
