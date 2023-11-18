package day8

import readInput

fun main() {

    fun String.sortLetters(): String = toList().sorted().joinToString("")

    fun readInput(isTest: Boolean = false): List<Pair<List<String>, List<String>>> =
        readInput("day8/Day08${if (isTest) "_test" else ""}")
            .map { line ->
                val (a: String, b: String) = line.split(" | ")
                Pair(
                    a.split(" ").map { it.sortLetters() },
                    b.split(" ").map { it.sortLetters() })
            }

    fun part1(input: List<Pair<List<String>, List<String>>>): Int {
        return input.map { (_, right) -> right }
            .flatten()
            .count {
                it.length in listOf(2, 3, 4, 7)
            }
    }

    fun getNumbersCorrespondences(input: List<String>): Map<String, Int> {

        fun <T> MutableList<T>.extract(predicate: (T) -> Boolean): T = first(predicate).also(::remove)

        fun String.containsAllCharsOf(word: String): Boolean {
            word.forEach { if (!this.contains(it)) return false }
            return true
        }

        val wordsOf5Pins = input.filter { it.length == 5 }.toMutableList()
        val wordsOf6Pins = input.filter { it.length == 6 }.toMutableList()
        val correspondence = mutableMapOf<Int, String>()

        correspondence[1] = input.first { it.length == 2 }
        correspondence[4] = input.first { it.length == 4 }
        correspondence[7] = input.first { it.length == 3 }
        correspondence[8] = input.first { it.length == 7 }
        correspondence[3] = wordsOf5Pins.extract { it.containsAllCharsOf(correspondence[1]!!) }
        correspondence[6] = wordsOf6Pins.extract { !it.containsAllCharsOf(correspondence[1]!!) }
        correspondence[5] = wordsOf5Pins.extract { correspondence[6]!!.containsAllCharsOf(it) }
        correspondence[2] = wordsOf5Pins.first()
        correspondence[9] = wordsOf6Pins.extract { it.containsAllCharsOf(correspondence[3]!!) }
        correspondence[0] = wordsOf6Pins.first()

        return correspondence.entries.associate { (k, v) -> v to k }
    }

    fun decodeLine(input: Pair<List<String>, List<String>>): Int {
        val (entry: List<String>, output: List<String>) = input
        val correspondence = getNumbersCorrespondences(entry)
        return output.map { correspondence[it]!! }
            .joinToString("")
            .let(Integer::parseInt)
    }

    fun part2(input: List<Pair<List<String>, List<String>>>): Int {
        return input.map(::decodeLine).sum()
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 26)
    check(part2(testInput) == 61229)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}