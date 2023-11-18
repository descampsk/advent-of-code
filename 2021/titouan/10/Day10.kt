package day10

import readInput

fun main() {

    val illegalCharacterScores = mapOf(')' to 3, ']' to 57, '}' to 1197, '>' to 25137)
    val missingCharacterScores = mapOf('(' to 1, '[' to 2, '{' to 3, '<' to 4)
    val openClosePairs = mapOf('(' to ')', '[' to ']', '{' to '}', '<' to '>')
    val minimalChunks = openClosePairs.map { (a, b) -> "$a$b" }

    fun String.containsNoneOf(elements: Collection<String>): Boolean =
        elements.none { this.contains(it) }

    fun String.excludingAllOf(excludingList: List<String>): String {
        var result = this
        excludingList.forEach {
            result = result.split(it).joinToString("")
        }
        return result
    }

    fun readInput(isTest: Boolean = false) =
        readInput("day10/Day10${if (isTest) "_test" else ""}")

    fun getScoreForLine(line: String, scoreForIncompleteLines: Boolean = false): Long {
        if (line.containsNoneOf(minimalChunks)) {
            return if (scoreForIncompleteLines) {
                if (line.any { it in openClosePairs.values }) 0
                else line
                    .reversed()
                    .map { missingCharacterScores[it]!!.toLong() }
                    .fold(0L) { sum, charScore -> sum * 5 + charScore }
            } else {
                line
                    .firstOrNull { it in openClosePairs.values }
                    ?.let(illegalCharacterScores::get)
                    ?.toLong() ?: 0L
            }
        }

        return getScoreForLine(line.excludingAllOf(minimalChunks), scoreForIncompleteLines)
    }

    fun part1(input: List<String>): Long {
        return input.sumOf(::getScoreForLine)
    }

    fun part2(input: List<String>): Long {
        val a = input
            .map { getScoreForLine(it, true) }
            .filter { it > 0 }
            .sorted()

        return a[a.size / 2]
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 26397L)
    check(part2(testInput) == 288957L)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}