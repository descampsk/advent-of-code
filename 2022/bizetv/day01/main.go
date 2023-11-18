package main

import (
	"fmt"
	"sort"
	"strconv"

	"aoc2022/tools"
)

func main() {

	filePath := "./input01"
	fileLines := tools.ReadLine(filePath)

	var calories = 0
	var elfs []int
	for _, line := range fileLines {
		if len(line) == 0 {
			elfs = append(elfs, calories)
			calories = 0
		} else {
			intVar, _ := strconv.Atoi(line)
			calories += intVar
		}
	}

	sort.Ints(elfs)

	fmt.Printf("Part1 Solution: %d\n", elfs[len(elfs)-1])
	fmt.Printf("Part2 Solution: %d\n", elfs[len(elfs)-1]+elfs[len(elfs)-2]+elfs[len(elfs)-3])
}
