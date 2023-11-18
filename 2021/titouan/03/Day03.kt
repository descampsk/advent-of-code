package day3

import readInput

fun main() {

    fun List<Int>.binaryToInt() = Integer.parseInt(joinToString(""), 2)
    fun List<Int>.binaryInv() = map { if (it == 1) 0 else 1 }

    fun findRating(input: List<List<Int>>, bitPosition: Int, criteria: (Int, Int) -> Boolean): Int {
        if (input.size == 1) return input.first().binaryToInt()

        val bitCriteria = if (criteria(input.sumOf { it[bitPosition] } * 2, input.size)) 1 else 0
        val newInput = input.filter { it[bitPosition] == bitCriteria }
        return findRating(newInput, bitPosition + 1, criteria)
    }

    fun findOxygenGeneratorRating(input: List<List<Int>>): Int =
        findRating(input, 0) { sum, inputSize -> sum >= inputSize }

    fun findCo2ScrubberRating(input: List<List<Int>>): Int =
        findRating(input, 0) { sum, inputSize -> sum < inputSize }

    fun part1(input: List<List<Int>>): Int {
        val inputSize = input.size

        val gamma = List(input[0].size) { bitPosition ->
            input.map { it[bitPosition] }
        }.map {
            if (it.sum() * 2 > inputSize) 1 else 0
        }

        val epsilon = gamma.binaryInv()

        return gamma.binaryToInt() * epsilon.binaryToInt()
    }

    fun part2(input: List<List<Int>>): Int = findOxygenGeneratorRating(input) * findCo2ScrubberRating(input)

    fun String.separateBits(): List<Int> = this.toList().map { Character.getNumericValue(it) }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("day3/Day03_test").map { it.separateBits() }
    check(part1(testInput) == 198)
    check(part2(testInput) == 230)

    val input = readInput("day3/Day03").map { it.separateBits() }
    println(part1(input))
    println(part2(input))
}

