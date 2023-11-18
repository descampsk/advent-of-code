package day11

import readInput

fun main() {

    fun readInput(isTest: Boolean = false): OctopusesMatrix =
        readInput("day11/Day11${if (isTest) "_test" else ""}")
            .map { line -> line.map { Octopus(energy = "$it".toInt()) } }

    operator fun List<List<Int>>.plus(matrix: List<List<Int>>) =
        List(matrix.size) { y ->
            List(matrix.size) { x ->
                matrix[x][y] + if (isEmpty()) 0 else this[x][y]
            }
        }

    fun MutableOctopusesMatrix.flashOnPoint(pointX: Int, pointY: Int, step: Int) {
        for (x in (pointX - 1)..(pointX + 1)) {
            for (y in (pointY - 1)..(pointY + 1)) {
                if (x == pointX && y == pointY) this[x][y].flash(step)
                else if (x in this.indices && y in this.indices) this[x][y].energy++
            }
        }
    }

    fun MutableOctopusesMatrix.applyFlashes(stepNumber: Int) {
        while (this.anyOnMatrix { it.needsToFlash(stepNumber) }) {
            this.forEachOfMatrixIndexed { x, y, octopus ->
                if (octopus.energy > 9 && !octopus.hasAlreadyFlashed(stepNumber)) {
                    this.flashOnPoint(x, y, stepNumber)
                }
            }
        }
    }

    fun part1(input: OctopusesMatrix, stepsNumber: Int): Long {
        val octopuses = input.toMutableOctopusesMatrix()
        var flashesNumber = 0L
        repeat(stepsNumber) { stepNumber ->
            octopuses.forEachOfMatrix { it.energy++ }

            octopuses.applyFlashes(stepNumber)

            octopuses.forEachOfMatrix {
                if (it.energy > 9) it.energy = 0
            }
            flashesNumber += octopuses.countOnMatrix { it.energy == 0 }
        }
        return flashesNumber
    }

    fun part2(input: OctopusesMatrix): Int {
        val octopuses = input.toMutableOctopusesMatrix()
        var stepNumber = 0
        while (octopuses.anyOnMatrix { it.energy != 0 }) {
            octopuses.forEachOfMatrix { it.energy++ }

            octopuses.applyFlashes(stepNumber)

            octopuses.forEachOfMatrix {
                if (it.energy > 9) it.energy = 0
            }
            stepNumber++
        }

        return stepNumber
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput, 100) == 1656L)
    check(part2(testInput) == 195)

    val input = readInput()
    println(part1(input, 100))
    println(part2(input))
}

data class Octopus(var energy: Int, var lastStepFlashed: Int = -1) {
    fun hasAlreadyFlashed(step: Int) = step == lastStepFlashed
    fun flash(step: Int) {
        lastStepFlashed = step
    }

    fun needsToFlash(step: Int) = energy > 9 && lastStepFlashed < step
}

typealias OctopusesMatrix = List<List<Octopus>>
typealias MutableOctopusesMatrix = MutableList<MutableList<Octopus>>

fun OctopusesMatrix.toMutableOctopusesMatrix(): MutableOctopusesMatrix =
    this.map { line -> line.map { it.copy() }.toMutableList() }.toMutableList()

fun MutableOctopusesMatrix.forEachOfMatrix(action: (Octopus) -> Unit) {
    this.forEach { line -> line.forEach(action) }
}

fun OctopusesMatrix.forEachOfMatrixIndexed(action: (Int, Int, Octopus) -> Unit) {
    this.forEachIndexed { x, line ->
        line.forEachIndexed { y, element -> action(x, y, element) }
    }
}

fun OctopusesMatrix.countOnMatrix(predicate: (Octopus) -> Boolean): Int = sumOf { line -> line.count(predicate) }

fun OctopusesMatrix.anyOnMatrix(predicate: (Octopus) -> Boolean): Boolean = any { line -> line.any(predicate) }