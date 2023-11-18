package day6

import readInput

fun main() {

    fun readInput(isTest: Boolean = false): Map<Int, Long> =
        readInput("day6/Day06${if (isTest) "_test" else ""}")
            .first()
            .split(",")
            .groupBy { it.toInt() }
            .mapValues { (_, fishes) -> fishes.size.toLong() }

    fun simulateLife(fishesByTimer: Map<Int, Long>, remainingIterations: Int): Long {
        if (remainingIterations == 0) return fishesByTimer.values.sum()

        val newMap = (0..8).associateWith { i ->
            when (i) {
                6 -> fishesByTimer.getOrDefault(i + 1, 0) + fishesByTimer.getOrDefault(0, 0)
                8 -> fishesByTimer.getOrDefault(0, 0)
                else -> fishesByTimer.getOrDefault(i + 1, 0)
            }
        }

        return simulateLife(newMap, remainingIterations - 1)
    }

    fun part1(input: Map<Int, Long>): Long {
        return simulateLife(input, 80)
    }

    fun part2(input: Map<Int, Long>): Long {
        return simulateLife(input, 256)
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 5934L)
    check(part2(testInput) == 26984457539)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}