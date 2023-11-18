package main

import (
	"fmt"
	"strings"

	"../tools"
)

func main() {

	filePath := "./input03"

	fileLines := tools.ReadLine(filePath)

	const alpabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var rucksacks [][2]string
	var rucksacks2 [][3]string
	var priority = 0
	var priority2 = 0

	for _, line := range fileLines {
		rucksacks = append(rucksacks, [2]string{line[0:(len(line) / 2)], line[(len(line) / 2):]})
	}
	for i, line := range fileLines {
		if i%3 == 2 {
			rucksacks2 = append(rucksacks2, [3]string{fileLines[i-2], fileLines[i-1], line})
		}
	}

	for _, compartments := range rucksacks2 {
		for _, item := range compartments[2] {
			res := strings.Contains(compartments[0], string(item))
			res2 := strings.Contains(compartments[1], string(item))
			if res && res2 {
				priority2 += (strings.Index(alpabets, string(item)) + 1)
				//fmt.Printf("%s %s %s contains => %c = %d \n", compartments[0], compartments[1], compartments[2], item, strings.Index(alpabets, string(item))+1)
				break
			}
		}

	}

	for _, compartments := range rucksacks {
		for _, item := range compartments[1] {
			res := strings.Contains(compartments[0], string(item))
			if res == true {
				//fmt.Printf("%s contains => %c = %d \n", compartments[0], item, strings.Index(alpabets, string(item))+1)
				priority += (strings.Index(alpabets, string(item)) + 1)
				break
			}

		}

	}
	fmt.Printf("Part1 Solution: %d\n", priority)
	fmt.Printf("Part2 Solution: %d\n", priority2)

}
