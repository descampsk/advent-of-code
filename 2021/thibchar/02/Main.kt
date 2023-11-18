package daytwo

import java.io.File

fun main(args: Array<String>) {
    val directions = File("src/main/kotlin/daytwo/input.txt").readLines()

    println("Part 1 : ${part1(directions)}")
    println("Part 2 : ${part2(directions)}")
}

fun part1(input: List<String>): Int {
    var depth = 0
    var horizontalPosition = 0
    input.forEach { direction ->
        val value = direction.filter { it.isDigit() }.toInt()
        when  {
            direction.contains("forward") -> horizontalPosition += value
            direction.contains("up") -> depth -= value
            direction.contains("down") -> depth += value
        }
    }
    return depth*horizontalPosition
}

fun part2(input: List<String>): Int {
    var depth = 0
    var horizontalPosition = 0
    var aim = 0
    input.forEach { direction ->
        val value = direction.filter { it.isDigit() }.toInt()
        when  {
            direction.contains("forward") -> {
                horizontalPosition += value
                depth += aim * value
            }
            direction.contains("up") -> aim -= value
            direction.contains("down") -> aim += value
        }
    }
    return depth*horizontalPosition
}
