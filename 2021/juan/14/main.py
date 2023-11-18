import data
from collections import Counter


basePolymer = data.basePolymer
insertionRules = data.insertionRules


def getInsertionRuleFromPair(pair, insertionRules):
    return insertionRules.get(pair)


def updatePolymerWithRules(basePolymer, insertionRules):
    polymer = ""

    for index in range(0, len(basePolymer) - 1):
        polymer += basePolymer[index]
        
        pair = basePolymer[index:index+2]
        insertionRule = getInsertionRuleFromPair(pair, insertionRules)

        if insertionRule is not None:
            polymer += insertionRule
        
    polymer += basePolymer[-1]

    return polymer


def getElementOccurence(polymer):
    return Counter(polymer)


def partOne(basePolymer, insertionRules, steps = 10):
    polymer = basePolymer

    for index in range(steps):
        polymer = updatePolymerWithRules(polymer, insertionRules)

    charOccurence = getElementOccurence(polymer)

    mostCommonElement = max(charOccurence, key=charOccurence.get)
    leastCommonElement = min(charOccurence, key=charOccurence.get)
    
    return charOccurence[mostCommonElement] - charOccurence[leastCommonElement]
