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
	var oldDepth int = -1
	var totalDeepthIncrease int = 0
	for {
		line, _, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		newDepth, err := strconv.Atoi(string(line))
		if oldDepth != -1 {
			if oldDepth > newDepth {
				fmt.Println(strconv.Itoa(newDepth) + " (decreased)")
			} else if oldDepth < newDepth {
				fmt.Println(strconv.Itoa(newDepth) + " (increased)")
				totalDeepthIncrease += 1
			}
		} else {
			fmt.Println(strconv.Itoa(newDepth) + " (N/A - no previous measurement)")
		}
		oldDepth = newDepth

		depthArray = append(depthArray, newDepth)
		check(err)
		//fmt.Println(" frquency[" + strconv.Itoa(frequency) + "] modifValue[" + strconv.Itoa(modifValue) + "]")
	}
	fmt.Println(totalDeepthIncrease)

}
