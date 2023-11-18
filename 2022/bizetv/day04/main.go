package main

import (
	"fmt"
	"strconv"
	"strings"

	"../tools"
)

func main() {

	filePath := "./input04"

	fileLines := tools.ReadLine(filePath)
	contains := 0
	overlap := 0
	for _, line := range fileLines {
		tmp := strings.Split(line, ",")
		tmp01 := strings.Split(tmp[0], "-")
		tmp02 := strings.Split(tmp[1], "-")
		tmp0101, _ := strconv.Atoi(tmp01[0])
		tmp0102, _ := strconv.Atoi(tmp01[1])
		tmp0201, _ := strconv.Atoi(tmp02[0])
		tmp0202, _ := strconv.Atoi(tmp02[1])
		tmp1 := [2]int{tmp0101, tmp0102}
		tmp2 := [2]int{tmp0201, tmp0202}

		if tmp1[0] <= tmp2[0] && tmp1[1] >= tmp2[1] {
			contains++
			//fmt.Printf("[%d-%d] is in [%d - %d]\n", tmp2[0], tmp2[1], tmp1[0], tmp1[1])
		} else if tmp2[0] <= tmp1[0] && tmp2[1] >= tmp1[1] {
			contains++
			//fmt.Printf("[%d-%d] is in [%d - %d]\n", tmp1[0], tmp1[1], tmp2[0], tmp2[1])
		}
		if (tmp1[0] <= tmp2[0] && tmp1[1] >= tmp2[0]) || (tmp1[0] <= tmp2[1] && tmp1[1] >= tmp2[1]) {
			overlap++
		} else if (tmp2[0] <= tmp1[0] && tmp2[1] >= tmp1[0]) || (tmp2[0] <= tmp1[1] && tmp2[1] >= tmp1[1]) {
			overlap++
		}
	}
	fmt.Printf("Part1 Solution: %d\n", contains)
	fmt.Printf("Part2 Solution: %d\n", overlap)
}
