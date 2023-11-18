import json

file = open('./data.json')
pairs = json.load(file)


def isSectionContainingOther(section, other):
    return other[0] >= section[0] and other[1] <= section[1]


def isSectionOverlapingOther(section, other):
    return section[1] >= other[0] and section[0] <= other[1]


countOne = 0
countTwo = 0
for pair in pairs:
    elfOneSections, elfTwoSections = pair

    if isSectionContainingOther(elfOneSections, elfTwoSections) or isSectionContainingOther(elfTwoSections, elfOneSections):
        countOne += 1

    if isSectionOverlapingOther(elfOneSections, elfTwoSections) or isSectionContainingOther(elfTwoSections, elfOneSections):
        countTwo += 1

print(countOne)
print(countTwo)
