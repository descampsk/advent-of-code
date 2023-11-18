package day9

import readInput
import java.util.*

fun main() {

    fun readInput(isTest: Boolean = false): Matrix =
        readInput("day9/Day09${if (isTest) "_test" else ""}")
            .map { line -> line.toList().map { Integer.parseInt("$it") } }


    fun findLowestPoints(input: Matrix): List<Point> =
        input.mapIndexed { y, line ->
            List(line.size) { x ->
                if ((x > 0 && line[x - 1] <= line[x]) ||
                    (x < line.lastIndex && line[x + 1] <= line[x]) ||
                    (y > 0 && input[y - 1][x] <= line[x]) ||
                    (y < input.lastIndex && input[y + 1][x] <= line[x])
                ) {
                    return@List null
                }

                return@List Point(x, y)
            }
        }.flatten().filterNotNull()

    fun part1(input: Matrix): Int =
        findLowestPoints(input).sumOf {
            input[it] + 1
        }

    fun Matrix.getNeighboursOf(point: Point): List<Point> = listOf(
        Point(point.x - 1, point.y),
        Point(point.x + 1, point.y),
        Point(point.x, point.y + 1),
        Point(point.x, point.y - 1)
    ).filter {
        it.x in this[0].indices && it.y in this.indices
    }

    fun findBasin(input: Matrix, start: Point): List<Point> {
        val queue: Queue<Point> = LinkedList(listOf(start))
        val visitedPoints = mutableListOf<Point>()
        while (queue.isNotEmpty()) {
            for (neighbour in input.getNeighboursOf(queue.poll())) {
                if (neighbour !in visitedPoints && input[neighbour] != 9) {
                    queue.add(neighbour)
                    visitedPoints.add(neighbour)
                }
            }
        }
        return visitedPoints.toList()
    }

    fun part2(input: List<List<Int>>): Int {
        val a = findLowestPoints(input).map {
            findBasin(input, it).size
        }
        return a.sortedDescending()
            .take(3)
            .fold(1) { acc, i -> acc * i }
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 15)
    check(part2(testInput) == 1134)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}

typealias Matrix = List<List<Int>>

operator fun Matrix.get(point: Point) = this[point.y][point.x]

data class Point(val x: Int, val y: Int)