package day7

import readInput
import kotlin.math.abs

fun main() {

    fun readInput(isTest: Boolean = false): List<Int> =
        readInput("day7/Day07${if (isTest) "_test" else ""}")
            .first()
            .split(",")
            .map { it.toInt() }

    fun part1(input: List<Int>): Int {
        return (0..input.maxOf { it }).map { meetingPosition ->
            input.sumOf { abs(meetingPosition - it) }
        }.minOf { it }
    }

    fun part2(input: List<Int>): Int {
        return (0..input.maxOf { it }).map { meetingPosition ->
            input.sumOf {
                val distance = abs(meetingPosition - it)
                (distance + 1) * distance / 2
            }
        }.minOf { it }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 37)
    check(part2(testInput) == 168)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}