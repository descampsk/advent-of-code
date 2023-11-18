
fun main() {

    fun part1(input: List<List<String>>) {
        input
            .map { if (it[0] == "up") listOf(it[0], "-${it[1]}") else it }
            .partition { it[0] == "forward" }
            .apply {
                val horizontalPosition = first.fold(0) { acc, list ->  acc + list[1].toInt() }
                val depthPosition = second.fold(0) { acc, list ->  acc + list[1].toInt() }
                println(horizontalPosition * depthPosition)
            }
    }

    fun part2(input: List<List<String>>) {
        var depth = 0
        var aim = 0
        var horizontalPosition = 0

        for ((action, value) in input) {
            val intValue = value.toInt()
            when (action) {
                "forward" -> {
                    horizontalPosition += intValue
                    depth += intValue * aim
                }
                "down" -> aim += intValue
                "up" -> aim -= intValue
            }
        }

        println(horizontalPosition * depth)
    }

    val testInput = readInput("Day02_data").map { it.split(" ") }
    part1(testInput)
    part2(testInput)
}


