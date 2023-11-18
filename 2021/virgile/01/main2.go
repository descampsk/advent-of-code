package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
)

func check(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	file, err := os.Open("input.txt")
	check(err)
	defer file.Close()
	reader := bufio.NewReader(file)
	var depthArray []int
	var depthArray3 []int
	//var totalDeepthIncrease int = 0
	for {
		line, _, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		newDepth, err := strconv.Atoi(string(line))
		check(err)
		depthArray = append(depthArray, newDepth)
		if len(depthArray) >= 3 {
			depthArray3 = append(depthArray3, depthArray[len(depthArray)-1]+depthArray[len(depthArray)-2]+depthArray[len(depthArray)-3])
		}
	}
	var oldDepth int = -1
	var totalDeepthIncrease int = 0
	for index, element := range depthArray3 {
		if oldDepth != -1 {
			if oldDepth > element {
				fmt.Println(strconv.Itoa(element) + " (decreased)")
			} else if oldDepth < element {
				fmt.Println(strconv.Itoa(element) + " (increased)")
				totalDeepthIncrease += 1
			}
		} else {
			fmt.Println(strconv.Itoa(element) + " (N/A - no previous measurement)")
		}
		if index < len(depthArray3) {
			oldDepth = depthArray3[index]
		}

	}
	fmt.Println(totalDeepthIncrease)

}
