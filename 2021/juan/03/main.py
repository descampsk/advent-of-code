import data
import exampleData


diagnostic = data.diagnostic
exampleDiagnostic = exampleData.diagnostic


""" PART ONE """

def getBinaryGammeRate(diagnostic):
    sizeArray = len(diagnostic)
    oneCount = [0] * len(diagnostic[0])

    for diag in diagnostic:
        digits = list(map(int, list(diag)))
        
        for key, value in enumerate(digits):
            if value == 1:
                oneCount[key] += 1

    results = []
    for digit in oneCount:
        if digit > sizeArray / 2:
            results.append(1)
        else:
            results.append(0)
    return "".join(map(str, results))


def getBinaryEpsilonRateFromBinaryGammaRate(binaryGammeRate):
    binary = list(map(int, list(binaryGammeRate)))
    results = []
    for digit in binary:
        if digit == 0:
            results.append(1)
        else:
            results.append(0)
    return "".join(map(str, results))


binaryGammeRate = getBinaryGammeRate(diagnostic)
binaryEpsilonRate = getBinaryEpsilonRateFromBinaryGammaRate(binaryGammeRate)

gammeRate = int(binaryGammeRate, 2)
epsilonRate = int(binaryEpsilonRate, 2)

print(f"binaryGammeRate: {binaryGammeRate} => gammeRate: {gammeRate}")
print(f"binaryEpsilonRate: {binaryEpsilonRate} => epsilonRate: {epsilonRate}")

powerConsumption = gammeRate * epsilonRate
print(f"powerConsumption: {powerConsumption}")


""" PART TWO """

def getMostCommonNumber(diagnostic, position):
    oneCount = 0
    sizeArray = len(diagnostic)

    for diag in diagnostic:
        if diag[position] == "1":
            oneCount += 1
    
    if oneCount >= sizeArray / 2:
        return 1
    
    return 0


def filterDiagnostics(diagnostic, index, filter):
    filteredDiagnostic = []

    for diag in diagnostic:
        if diag[index] == filter:
            filteredDiagnostic.append(diag)
    
    return filteredDiagnostic


def getO2GeneratorRating(diagnostic):
    index = 0
    flag = True
    filteredDiagnostic = diagnostic

    while flag:
        mostCommonDigit = getMostCommonNumber(filteredDiagnostic, index)
        filteredDiagnostic = filterDiagnostics(
            filteredDiagnostic, index, str(mostCommonDigit))
        
        index += 1
        flag = index < len(diagnostic[0]) and len(filteredDiagnostic) > 1

    return int("".join(filteredDiagnostic), 2)


def getCO2ScrubberRating(diagnostic):
    index = 0
    flag = True
    filteredDiagnostic = diagnostic

    while flag:
        leastCommonDigit = 0 if getMostCommonNumber(filteredDiagnostic, index) == 1 else 1
        filteredDiagnostic = filterDiagnostics(
            filteredDiagnostic, index, str(leastCommonDigit))
        
        index += 1
        flag = index < len(diagnostic[0]) and len(filteredDiagnostic) > 1

    return int("".join(filteredDiagnostic), 2)


O2GeneratorRating = getO2GeneratorRating(diagnostic)
CO2ScrubberRating = getCO2ScrubberRating(diagnostic)

lifeSupportRating = O2GeneratorRating * CO2ScrubberRating
print(f"lifeSupportRating: {lifeSupportRating}")
