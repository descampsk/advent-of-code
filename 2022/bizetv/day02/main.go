package main

import (
	"aoc2022/tools"
	"fmt"
	"strings"
)

/*
W:6
D:3
L:0

A:R
B:P
C:S

X:R:1
Y:P:2
Z:S:3
*/

func matchCalc(match []string) int {
	point := 0
	switch match[1] {
	case "X":
		point += 1
	case "Y":
		point += 2
	case "Z":
		point += 3
	}

	if (match[0] == "A" && match[1] == "X") || (match[0] == "B" && match[1] == "Y") || (match[0] == "C" && match[1] == "Z") {
		point += 3
	} else if (match[0] == "A" && match[1] == "Y") || (match[0] == "B" && match[1] == "Z") || (match[0] == "C" && match[1] == "X") {
		point += 6
	}
	return point
}

func stratCalc(match []string) int {
	point := 0
	switch match[1] {
	case "X":
		point += 0
		switch match[0] {
		case "A":
			point += 3
		case "B":
			point += 1
		case "C":
			point += 2
		}
	case "Y":
		point += 3
		switch match[0] {
		case "A":
			point += 1
		case "B":
			point += 2
		case "C":
			point += 3
		}
	case "Z":
		point += 6
		switch match[0] {
		case "A":
			point += 2
		case "B":
			point += 3
		case "C":
			point += 1
		}
	}

	return point
}

func main() {

	filePath := "./input02"
	fileLines := tools.ReadLine(filePath)
	//tmpfileLines := []string{"A Y", "B X", "C Z"}
	stratPoint := 0
	point := 0

	for _, line := range fileLines {
		match := strings.Split(line, " ")
		point += matchCalc(match)
		//fmt.Printf("Match %s : Point = %d\n", match, matchCalc(match))
	}

	for _, line := range fileLines {
		match := strings.Split(line, " ")
		stratPoint += stratCalc(match)
		fmt.Printf("Match %s : Point = %d\n", match, stratCalc(match))
	}
	fmt.Println(stratPoint)
}
