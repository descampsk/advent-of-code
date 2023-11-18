package dayseven

import java.io.File
import kotlin.math.absoluteValue

fun main(args: Array<String>) {
    val input = File("src/main/kotlin/dayseven/input.txt").readLines()[0].split(",")

    val crabs = input.map { Integer.parseInt(it, 10) }
    part1(crabs)
    part2(crabs)
}

fun part1(crabs: List<Int>) {
    var minimalValue = crabs.sum()
    var sumValue = 0
    var bestResult = 0
    for (i in crabs.minOrNull()!!..crabs.maxOrNull()!!) {
        sumValue = crabs.sumOf { (i - it).absoluteValue }
        if (sumValue in 1 until minimalValue) {
            minimalValue = sumValue
            bestResult = i
        }
    }
    println("Part 1 result is $bestResult")
    println("Part 1 resultis $minimalValue")
}

fun part2(crabs: List<Int>) {
    var minimalValue = 1000000000
    var sumValue = 0
    var bestResult = 0
    for (i in crabs.minOrNull()!!..crabs.maxOrNull()!!) {
        sumValue = crabs.sumOf {makeSumZeroToValue((i - it).absoluteValue) }
        if (sumValue in 1 until minimalValue) {
            minimalValue = sumValue
            bestResult = i
        }
    }
    println("Part 2 best result is $bestResult")
    println("Part 2 result is $minimalValue")
}

fun makeSumZeroToValue(value: Int): Int {
    var returnValue = 0
    for (i in 0..value) {
        returnValue += i
    }
    return returnValue
}
