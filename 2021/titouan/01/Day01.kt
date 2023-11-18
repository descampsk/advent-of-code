package day1

import readInput

fun main() {
    fun part1(input: List<Int>): Int {
        return input
            .zipWithNext { a, b -> b > a }
            .count { it }
    }

    fun part2(input: List<Int>): Int {
        return input
            .windowed(3, 1, false) { it.sum() }
            .zipWithNext { a, b -> b > a }
            .count { it }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("day1/Day01_test").map { it.toInt() }
    check(part1(testInput) == 7)
    check(part2(testInput) == 5)

    val input = readInput("day1/Day01").map { it.toInt() }
    println(part1(input))
    println(part2(input))
}
