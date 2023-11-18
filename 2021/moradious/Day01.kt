
fun main() {

    fun part1(input: List<Int>): Int {
        return input.windowed(2).countSuperiority()
    }

    fun part2(input: List<Int>): Int {
        return input
            .windowed(3) { it.sum() }
            .windowed(2)
            .countSuperiority()
    }

    val testInput = readInput("Day01_data").map { it.toInt() }
    println(part1(testInput))
    println(part2(testInput))
}

fun List<List<Int>>.countSuperiority(): Int = count { it[0] < it[1] }

