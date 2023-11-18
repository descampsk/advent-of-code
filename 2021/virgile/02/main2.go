package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
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

	var deepth int = 0
	var y int = 0
	var aim int = 0
	for {
		line, _, err := reader.ReadLine()
		if err == io.EOF {
			break
		}
		var depthhMod int = 0
		var yMod int = 0
		var aimMod int = 0
		commands := strings.Fields(string(line))
		switch commands[0] {
		case "down":
			depthhMod, _ = strconv.Atoi(commands[1])
			aimMod = depthhMod
			depthhMod = 0
			break
		case "up":
			depthhMod, _ = strconv.Atoi(commands[1])
			depthhMod = depthhMod * -1
			aimMod = depthhMod
			depthhMod = 0
			break
		case "forward":
			yMod, _ = strconv.Atoi(commands[1])
			depthhMod += aim * yMod
			break
		}
		aim += aimMod
		y += yMod
		deepth += depthhMod
		check(err)
	}
	fmt.Println(y * deepth)

}
