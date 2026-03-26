import csv
import json

with open('./auxiliaryFiles/features5E.csv', newline='') as f:
    reader = csv.reader(f)
    dataCSV = list(reader)

dataDict = {}
for j in range(2,134):
    if not dataCSV[j][0].replace(" ", "").lower().replace("\u2019", "") in dataDict:
        dataDict[dataCSV[j][0].replace(" ", "").lower().replace("\u2019", "")] = {}
    dataDict[dataCSV[j][0].replace(" ", "").lower().replace("\u2019", "")][dataCSV[j][1].replace(" ", "").lower().replace("\u2019", "")] = {}
    for i in range(32):
        index = i*3+2
        if int(dataCSV[j][index]) < 21 and dataCSV[j][index+2] != "" and dataCSV[j][index+1] != "Ability Score Improvement":
            dataDict[dataCSV[j][0].replace(" ", "").lower()][dataCSV[j][1].replace(" ", "").lower().replace("\u2019", "")][dataCSV[j][index+1].replace(" ", "").lower().replace("\u2019", "")] = {
                "level":dataCSV[j][index],
                "description":dataCSV[j][index+2].replace("\u2019", "'")
                }



with open('./auxiliaryFiles/features5E.json', 'w') as f:
    json.dump(dataDict, f)
