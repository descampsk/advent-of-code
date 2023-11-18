import data

directions = data.directions

def formatDirections(directions):
    formattedDirections = []

    for direction in directions:
        splittedDirection = direction.split(" ")
        formattedDirections.append({
            "direction": splittedDirection[0],
            "vector": int(splittedDirection[1])
        })

    return formattedDirections

def partOne(directions):
    horizontalPosition = 0
    depth = 0

    for direction in directions:
        if direction["direction"] == "forward":
            horizontalPosition += direction["vector"]
        elif direction["direction"] == "up":
            depth -= direction["vector"]
        elif direction["direction"] == "down":
            depth += direction["vector"]
        else:
            print("I should not be here")
    
    return horizontalPosition * depth

def partTwo(directions):
    horizontalPosition = 0
    depth = 0
    aim = 0

    for direction in directions:
        if direction["direction"] == "forward":
            horizontalPosition += direction["vector"]
            depth += direction["vector"] * aim
        elif direction["direction"] == "up":
            aim -= direction["vector"]
        elif direction["direction"] == "down":
            aim += direction["vector"]
        else:
            print("I should not be here")
    
    return horizontalPosition * depth

formattedDirections = formatDirections(directions)

print(partOne(formattedDirections))
print(partTwo(formattedDirections))