import data
import exampleData


signals = data.signals


digitsMap = {
    0: 6,
    1: 2,
    2: 5,
    3: 5,
    4: 4,
    5: 5,
    6: 6,
    7: 3,
    8: 7,
    9: 6,
}

reversedDigitsMap = {
    2: [1],
    3: [7],
    5: [2, 3, 5],
    4: [4],
    6: [0, 6, 9],
    7: [8],
}

def partOne(signals):
    count = 0

    for signal in signals:
        digits = signal[1].split(" ")
        for digit in digits:
            if len(reversedDigitsMap[len(digit)]) == 1:
                count += 1
    
    return count

print(partOne(signals))