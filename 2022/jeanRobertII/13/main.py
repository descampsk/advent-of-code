import json


file = open('./sampleData.json')
packetPairs = json.load(file)
logs = open("logs.txt", "w")
logs.write("")


def compareLists(leftPacket, rightPacket) -> bool or None:
    logs.writelines(f"- Compare {leftPacket} vs {rightPacket}\n")

    for index in range(max(len(leftPacket), len(rightPacket))):
        if index >= len(leftPacket):
            logs.writelines(
                f"\t\tLeft side ran out of items, so inputs are in the right order\n")
            return True

        if index >= len(rightPacket):
            logs.writelines(
                f"\t\tRight side ran out of items, so inputs are not in the right order\n")
            return False

        logs.writelines(
            f"\t- Compare {leftPacket[index]} vs {rightPacket[index]}\n")

        if type(leftPacket[index]) is list and type(rightPacket[index]) is list:
            computation = compareLists(leftPacket[index], rightPacket[index])
            if computation is not None:
                return computation
            continue

        if type(leftPacket[index]) is list and type(rightPacket[index]) is int:
            computation = compareLists(leftPacket[index], [rightPacket[index]])
            if computation is not None:
                return computation
            continue

        if type(leftPacket[index]) is int and type(rightPacket[index]) is list:
            computation = compareLists([leftPacket[index]], rightPacket[index])
            if computation is not None:
                return computation
            continue

        if leftPacket[index] < rightPacket[index]:
            logs.writelines(
                f"\t\t- Left side is smaller, so inputs are in the right order\n")
            return True

        if leftPacket[index] > rightPacket[index]:
            logs.writelines(
                f"\t\t- Right side is smaller, so inputs are not in the right order\n")
            return False

    return None


orderCount = 0
for index, packetPair in enumerate(packetPairs):
    logs.writelines(f"== Pair {index + 1} ==\n")

    leftPacket = packetPair[0]
    rightPacket = packetPair[1]

    tmp = compareLists(leftPacket, rightPacket)

    orderCount += index + 1 if tmp else 0

    logs.writelines(f"\n")

print(orderCount)
