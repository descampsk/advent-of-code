import kotlin.math.abs

fun main() {

    fun part1(input: List<Int>): Int? =
        input
            .map { number -> input.map { entry -> abs(number - entry) }.sum() }
            .minOrNull()

    fun part2(input: List<Int>): Int? =
        input
            .map { number -> input.map { entry -> getTriangularNumber(abs(number - entry)) }.sum() }
            .minOrNull()

    val testInput = readInput("Day07_data")
    val data = testInput[0].split(",").map { it.toInt() }
    println(part1(data))
    println(part2(data))
}

fun getTriangularNumber(moves: Int): Int = moves * (moves + 1) / 2

