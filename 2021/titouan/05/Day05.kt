package day5

import readInput
import java.lang.Integer.max
import java.lang.Integer.min
import kotlin.math.abs

fun main() {

    fun max(vararg list: Int) = list.maxOf { it }

    fun countPointsWithCoverageAbove2(lines: List<Line>): Int {
        val diagramWidth = lines.maxOf { max(it.x1, it.y1, it.x2, it.y2) } + 1
        val diagram = List(diagramWidth) { y ->
            List(diagramWidth) { x ->
                lines.count { it.contains(x, y) }
            }
        }
        return diagram.flatten().count { it > 1 }
    }

    fun part1(input: List<String>): Int {
        val lines = input.map(Line::from)
            .filterNot { it.isDiagonal }

        return countPointsWithCoverageAbove2(lines)
    }

    fun part2(input: List<String>): Int {
        val lines = input.map(Line::from)

        return countPointsWithCoverageAbove2(lines)
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("day5/Day05_test")
    check(part1(testInput) == 5)
    check(part2(testInput) == 12)

    val input = readInput("day5/Day05")
    println(part1(input))
    println(part2(input))
}

data class Line(
    val x1: Int,
    val y1: Int,
    val x2: Int,
    val y2: Int
) {

    val isDiagonal: Boolean
        get() = x1 != x2 && y1 != y2

    fun contains(x: Int, y: Int) =
        (x in min(x1, x2)..max(x1, x2) && y in min(y1, y2)..max(y1, y2))
                && (!isDiagonal || (abs(x - x1) == abs(y - y1)))

    companion object {
        fun from(entry: String): Line {
            val (a: String, b: String) = entry.split(" -> ")
            val (x1, y1) = a.split(",").map { it.toInt() }
            val (x2, y2) = b.split(",").map { it.toInt() }
            return Line(x1, y1, x2, y2)
        }
    }

    override fun toString(): String {
        return "Line($x1,$y1 -> $x2,$y2)"
    }
}
