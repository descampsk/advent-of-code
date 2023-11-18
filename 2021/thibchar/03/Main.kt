package daythree

import java.io.File
import kotlin.experimental.inv

fun main(args: Array<String>) {
    val input = File("src/main/kotlin/daythree/input.txt").readLines()

    println("Part 1 power consumption : ${part1(input)}")
    println("Part 2 power consumption : ${part2(input)}")

}

fun part1(input: List<String>): Int {
    var gammaRate = ""
    var epsilon = ""
    for (indice in input[0].indices) {
        val column = input.map { Character.getNumericValue(it[indice]) }
        if (column.sum() > column.size/2) {
            gammaRate += "1"
            epsilon += "0"
        } else {
            gammaRate += "0"
            epsilon += "1"
        }
    }

    return Integer.parseInt(gammaRate, 2) * Integer.parseInt(epsilon, 2)
}

fun part2(input: List<String>): Int {
    var oxygenGenerator = input
    var co2Scrubber = input
    for (indice in input[0].indices) {
        if (oxygenGenerator.size == 1) break
        val oxygenColumn = oxygenGenerator.map { Character.getNumericValue(it[indice]) }
        oxygenGenerator = if (oxygenColumn.sum().toFloat() >= oxygenColumn.size.div(2f)) {
            oxygenGenerator.filter { it[indice] == '1' }
        } else {
            oxygenGenerator.filter { it[indice] == '0' }
        }
    }
    for (indice in input[0].indices) {
        if (co2Scrubber.size == 1) break
        val co2Column = co2Scrubber.map { Character.getNumericValue(it[indice]) }
        co2Scrubber = if (co2Column.sum().toFloat() < co2Column.size.div(2f)) {
            co2Scrubber.filter { it[indice] == '1' }
        } else {
            co2Scrubber.filter { it[indice] == '0' }
        }
    }

    return Integer.parseInt(oxygenGenerator[0], 2) * Integer.parseInt(co2Scrubber[0], 2)
}