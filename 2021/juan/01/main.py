import data

depths = data.data

def partOne(depths):
    count = 0
    for i in range(1, len(depths)):
        if depths[i] > depths[i - 1]:
            count += 1

    return count



def partTwo(depths):
    count = 0
    previousDepth = depths[0] + depths[1] + depths[2]
    for i in range(3, len(depths)):
        currentDepth = depths[i] + depths[i - 1] + depths[i - 2]
        if currentDepth > previousDepth:
            count += 1
        
        previousDepth = currentDepth

    return count

print("partOne", partOne(depths))
print("partTwo", partTwo(depths))
