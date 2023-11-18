package day2

import readInput

fun main() {
    fun part1(input: List<Command>): Int {
        return input.map {
            when (it) {
                is Command.Forward -> Coordinates(it.unitsNumber, 0)
                is Command.Up -> Coordinates(0, -it.unitsNumber)
                is Command.Down -> Coordinates(0, it.unitsNumber)
            }
        }
            .reduce { a, b -> a + b }
            .let { (x, y) -> x * y }
    }

    fun part2(input: List<Command>): Int {
        var aim = 0
        var coordinates = Coordinates(0, 0)

        input.forEach {
            when(it) {
                is Command.Down -> aim += it.unitsNumber
                is Command.Up -> aim -= it.unitsNumber
                is Command.Forward -> {
                    coordinates += Coordinates(it.unitsNumber, aim * it.unitsNumber)
                }
            }
        }

        return coordinates.x * coordinates.y
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("day2/Day02_test").map(Command::fromString)
    check(part1(testInput) == 150)
    check(part2(testInput) == 900)

    val input = readInput("day2/Day02").map(Command::fromString)
    println(part1(input))
    println(part2(input))
}

data class Coordinates(val x: Int, val y: Int) {
    operator fun plus(other: Coordinates) = Coordinates(x + other.x, y + other.y)
}

sealed class Command(val unitsNumber: Int) {

    class Forward(unitsNumber: Int) : Command(unitsNumber)
    class Up(unitsNumber: Int) : Command(unitsNumber)
    class Down(unitsNumber: Int) : Command(unitsNumber)

    companion object {
        fun fromString(string: String): Command {
            val (direction, units) = string.split(" ")
            return when (direction) {
                "forward" -> Forward(units.toInt())
                "up" -> Up(units.toInt())
                "down" -> Down(units.toInt())
                else -> throw IllegalArgumentException("This string doesn't contain a valid command")
            }
        }
    }
}
