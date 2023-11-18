package day14

import readInput

fun main() {

    fun readInput(isTest: Boolean = false): Pair<String, Map<String, String>> {
        val input = readInput("day14/Day14${if (isTest) "_test" else ""}")

        val rules = input.subList(2, input.size).map { line ->
            line.split(" -> ").let { it[0] to it[1] }
        }.toMap()

        return input[0] to rules
    }

    fun applyStep(input: WordsWithLettersOccurrences, rules: Map<String, String>): WordsWithLettersOccurrences {
        val newLettersOccurrences = input.letterWithOccurrences.toMutableMap()
        val newWordsWithOccurrences = input.wordsWithOccurrences.map { (word, occurrences) ->
            val newLetter = rules.getOrDefault(word, null)?.get(0) ?: return@map listOf((word to occurrences))
            newLettersOccurrences[newLetter] = newLettersOccurrences.getOrDefault(newLetter, 0) + occurrences
            return@map listOf(
                "${word[0]}$newLetter" to occurrences,
                "$newLetter${word[1]}" to occurrences,
            )
        }.flatten()
            .groupBy { it.first }
            .mapValues { it.value.sumOf { it.second } }
        return WordsWithLettersOccurrences(newWordsWithOccurrences, newLettersOccurrences)
    }

    fun solveProblem(input: Pair<String, Map<String, String>>, stepsNumber: Int): Long {
        val (template, rules) = input

        var wordsWithLettersOccurrences = WordsWithLettersOccurrences.createFromInput(template)
        repeat(stepsNumber) {
            wordsWithLettersOccurrences = applyStep(wordsWithLettersOccurrences, rules)
        }
        val letters = wordsWithLettersOccurrences.letterWithOccurrences.filter { it.value > 0 }
        return letters.maxOf { it.value } - letters.minOf { it.value }
    }

    fun part1(input: Pair<String, Map<String, String>>) =
        solveProblem(input, 10)


    fun part2(input: Pair<String, Map<String, String>>): Long =
        solveProblem(input, 40)

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    println(part1(testInput))
    check(part1(testInput) == 1588L)
    check(part2(testInput) == 2188189693529L)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}

data class WordsWithLettersOccurrences(
    val wordsWithOccurrences: Map<String, Long>,
    val letterWithOccurrences: Map<Char, Long>
) {

    companion object {
        fun createFromInput(input: String): WordsWithLettersOccurrences =
            WordsWithLettersOccurrences(
                input.windowed(2).groupBy { it }.mapValues { it.value.size.toLong() },
                ('A'..'Z').associateWith { letter -> input.count { it == letter }.toLong() }
            )
    }
}