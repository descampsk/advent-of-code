package day13

import readInput

fun main() {

    fun readInput(isTest: Boolean = false): Pair<List<Point>, List<FoldInstruction>> {
        val input = readInput("day13/Day13${if (isTest) "_test" else ""}")

        val points = input.takeWhile { it != "" }
            .map {
                val (x: String, y: String) = it.split(",")
                Point(x.toInt(), y.toInt())
            }

        val instructions = input.takeLastWhile { it != "" }
            .map { FoldInstruction.fromString(it.split("fold along ")[1]) }

        return Pair(points, instructions)
    }

    fun fold(points: List<Point>, instruction: FoldInstruction): List<Point> {
        val result = points
            .map { point ->
                when(instruction) {
                    is FoldInstruction.X -> {
                        if (point.x == instruction.coordinate) Point.INVALID
                        if (point.x < instruction.coordinate) point
                        else point.copy(x = instruction.coordinate * 2 - point.x)
                    }
                    is FoldInstruction.Y -> {
                        if (point.y == instruction.coordinate) Point.INVALID
                        if (point.y < instruction.coordinate) point
                        else point.copy(y = instruction.coordinate * 2 - point.y)
                    }
                }
            }
            .toMutableSet()
            .filter { it != Point.INVALID }

        return result
    }

    fun part1(input: Pair<List<Point>, List<FoldInstruction>>): Int {
        return fold(input.first, input.second.first()).size
    }

    fun part2(input: Pair<List<Point>, List<FoldInstruction>>): Int {
        val output = input.second.fold(input.first) { acc, instruction ->
            fold(acc, instruction)
        }
        repeat(output.maxOf { it.y } + 1) { y ->
            repeat(output.maxOf { it.x } + 1) { x ->
                print(
                    if (output.contains(Point(x, y))) "#"
                    else "."
                )
            }
            println()
        }
        return 0
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 17)
    check(part2(testInput) == 0)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}

sealed class FoldInstruction(val coordinate: Int) {
    class X(coordinate: Int) : FoldInstruction(coordinate)
    class Y(coordinate: Int) : FoldInstruction(coordinate)

    companion object {
        fun fromString(string: String): FoldInstruction {
            val (axis: String, value: String) = string.split("=")
            return if (axis == "x") X(value.toInt())
            else Y(value.toInt())
        }
    }
}

data class Point(val x: Int, val y: Int) {
    companion object {
        val INVALID = Point(-1, -1)
    }
}