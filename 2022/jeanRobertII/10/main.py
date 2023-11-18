import json

file = open('./data.json')
instructions = json.load(file)


totalSignalStrength = 0
cycle = 1
xValue = 1
for instruction in instructions:
    cycle += 1

    if cycle == 20 or (20 + cycle) % 40 == 0:
        totalSignalStrength += cycle * xValue

    if instruction.startswith('noop'):
        continue

    instructionValue = int(instruction.split()[1])
    cycle += 1
    xValue += instructionValue

    if cycle == 20 or (20 + cycle) % 40 == 0:
        totalSignalStrength += cycle * xValue


print(totalSignalStrength)
