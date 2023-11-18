package main

import (
	"fmt"
	"io/ioutil"
	"math"
	"strconv"
	"strings"
)

func ReadIntSlicesFromLines(filename string) (result [][]int) {
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil
	}

	for _, line := range strings.Split(string(content), "\n") {
		serie := make([]int, 0)
		for _, char := range []rune(line) {
			number, err := strconv.Atoi(string([]rune{char}))

			if err != nil {
				continue
			}

			serie = append(serie, number)
		}

		result = append(result, serie)
	}

	if len(result) == 0 {
		return nil
	}

	return result
}

func BinaryIntsToInt(slice []int) int {
	result := 0
	count := len(slice)

	for i, value := range slice {
		result += int(math.Pow(2, float64(count-i-1))) * value
	}

	return result
}

func solvePart1(input [][]int, result chan int) {
	half := len(input) / 2
	length := len(input[0])

	accumulator := make([]int, length)
	for _, number := range input {
		for i, digit := range number {
			accumulator[i] = accumulator[i] + digit
		}
	}

	γ := make([]int, length)
	ε := make([]int, length)
	for i, digit := range accumulator {
		if digit > half {
			γ[i] = 1
			ε[i] = 0
		} else {
			γ[i] = 0
			ε[i] = 1
		}
	}

	result <- BinaryIntsToInt(γ) * BinaryIntsToInt(ε)
}

func solvePartRec(input [][]int, index int, isMost bool) (newInput [][]int) {
	if len(input) <= 1 {
		return input
	}
	serie0 := make([][]int, 0)
	serie1 := make([][]int, 0)

	for _, number := range input {
		if number[index] == 0 {
			serie0 = append(serie0, number)
		} else {
			serie1 = append(serie1, number)
		}
	}

	if len(serie0) > len(serie1) {
		if isMost {
			return serie0
		} else {
			return serie1
		}
	} else if len(serie1) > len(serie0) {
		if isMost {
			return serie1
		} else {
			return serie0
		}
	} else {
		if isMost {
			return serie1
		} else {
			return serie0
		}
	}

}

func solvePart2(input [][]int, result chan int) {
	serieγ := input
	serieε := input
	γ := make([]int, len(input[0]))
	ε := make([]int, len(input[0]))
	for i := 0; i < len(input[0]); i++ {
		serieγ = solvePartRec(serieγ, i, true)
	}
	for i := 0; i < len(input[0]); i++ {
		serieε = solvePartRec(serieε, i, false)
	}

	γ = serieγ[0]
	ε = serieε[0]
	result <- BinaryIntsToInt(γ) * BinaryIntsToInt(ε)
}

func main() {
	input := ReadIntSlicesFromLines("./input.txt")

	if input != nil {
		result1 := make(chan int)
		result2 := make(chan int)

		go solvePart1(input, result1)
		go solvePart2(input, result2)

		fmt.Println(<-result1)
		fmt.Println(<-result2)
	} else {
		fmt.Errorf("failure when reading input data")
	}
}
