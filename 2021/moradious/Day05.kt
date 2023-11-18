import kotlin.math.max
import kotlin.math.min

val coordinates = mutableMapOf<Pair<Int, Int>, Int>()

fun main() {

    fun part1(input: List<List<String>>): Int {
        input.forEach {
            when {
                it[0] == it[2] -> {
                    updateCoordinates(it[0].toInt(), null, it[1].toInt(), it[3].toInt())
                }
                it[1] == it[3] -> {
                    updateCoordinates(null, it[1].toInt(), it[0].toInt(), it[2].toInt())
                }
                else -> {
                    // do nothing
                }
            }
        }

        return coordinates.count { it.value > 1 }
    }

    fun part2(input: List<List<String>>): Int {
        input.forEach {
            when {
                it[0] == it[2] -> {
                    updateCoordinates(it[0].toInt(), null, it[1].toInt(), it[3].toInt())
                }
                it[1] == it[3] -> {
                    updateCoordinates(null, it[1].toInt(), it[0].toInt(), it[2].toInt())
                }
                else -> {
                    updateDiagonalCoordinates(it[0].toInt(), it[1].toInt(), it[2].toInt(), it[3].toInt())
                }
            }
        }

        return coordinates.count { it.value > 1 }
    }

    val testInput = readInput("Day05_data")
    val data = testInput.map { it.replace(" -> ", ",").split(",") }

    println(part1(data))
    coordinates.clear()
    println(part2(data))
}

fun updateCoordinates(baseX: Int?, baseY: Int?, oneEnd: Int, otherEnd: Int) {

    for (i in min(oneEnd, otherEnd)..max(oneEnd, otherEnd)) {
        addCoordinates(Pair(baseX ?: i, baseY ?: i))
    }
}

fun updateDiagonalCoordinates(x1: Int, y1: Int, x2:Int, y2: Int) {

    if (isFortyFiveDegrees(x1, y1, x2, y2)) {
        var cpt = 0
        do {
            val newX = if (x1 < x2) x1 + cpt else x1 - cpt
            val newY = if (y1 < y2) y1 + cpt else y1 - cpt

            addCoordinates(Pair(newX, newY))
            cpt++
        } while (min(x1, x2) + cpt <= max(x1, x2) && min(y1, y2) + cpt <= max(y1, y2))
    }
}

fun addCoordinates(coordinate: Pair<Int, Int>) {

    if (coordinates.containsKey(coordinate)) {
        coordinates[coordinate] = coordinates[coordinate]!!.plus(1)
    } else {
        coordinates[coordinate] = 1
    }
}

fun isFortyFiveDegrees(x1: Int, y1: Int, x2:Int, y2: Int): Boolean =
    max(x1, x2) - min (x1, x2) == max(y1, y2) - min (y1, y2)
