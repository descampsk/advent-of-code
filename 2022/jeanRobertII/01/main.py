import json

file = open('./data.json')
calories = json.load(file)

caloriesStackValues = []

for caloriesStack in calories:
    caloriesStackValues.append(sum(caloriesStack))

caloriesStackValues.sort(reverse=True)

caloriesCount = caloriesStackValues[0] + \
    caloriesStackValues[1] + caloriesStackValues[2]

print(caloriesCount)
