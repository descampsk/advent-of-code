package dayfive

import java.io.File
import java.lang.Integer.max
import java.lang.Integer.min
import kotlin.math.absoluteValue

fun main(args: Array<String>) {
    val fromAndToPosition = File("src/main/kotlin/dayfive/input.txt").readLines().map { it.split("->") }
    val fromX = mutableListOf<Int>()
    val fromY = mutableListOf<Int>()
    val toX = mutableListOf<Int>()
    val toY = mutableListOf<Int>()

    for (i in fromAndToPosition.indices) {
        fromX.add(Integer.parseInt(fromAndToPosition[i][0].split(",")[0].trim(), 10))
        fromY.add(Integer.parseInt(fromAndToPosition[i][0].split(",")[1].trim(), 10))
        toX.add(Integer.parseInt(fromAndToPosition[i][1].split(",")[0].trim(), 10))
        toY.add(Integer.parseInt(fromAndToPosition[i][1].split(",")[1].trim(), 10))
    }
    val cloud = MutableList(1000) { MutableList(1000) { 0 } }

    part1(cloud, fromX, toX, fromY, toY)
    part2(cloud, fromX, toX, fromY, toY)
}

fun part1(cloud: MutableList<MutableList<Int>>, fromX: MutableList<Int>, toX: MutableList<Int>, fromY: MutableList<Int>, toY: MutableList<Int>) {
    val count = computeCloud(cloud, fromX, toX, fromY, toY, false).flatten().count { it >= 2 }
    println("Part1 puzzle : $count")
}
fun part2(cloud: MutableList<MutableList<Int>>, fromX: MutableList<Int>, toX: MutableList<Int>, fromY: MutableList<Int>, toY: MutableList<Int>, ) {
    val count = computeCloud(cloud, fromX, toX, fromY, toY, true).flatten().count { it >= 2 }
    println("Part2 puzzle : $count")
}

fun getRange(from: Int, to: Int) = if (from < to) from..to else from downTo to

fun computeCloud(cloud: MutableList<MutableList<Int>>, fromX: MutableList<Int>, toX: MutableList<Int>, fromY: MutableList<Int>, toY: MutableList<Int>, countDiagonals: Boolean): MutableList<MutableList<Int>> {
    for (i in fromX.indices) {
        val xMax = max(fromX[i], toX[i])
        val xMin = min(fromX[i], toX[i])
        if (fromX[i] == toX[i]) {
            for (j in getRange(fromY[i], toY[i])) {
                cloud[fromX[i]][j] += 1
            }
        }

        if (fromY[i] == toY[i]) {
            for (j in getRange(fromX[i], toX[i]))
                cloud[j][fromY[i]] += 1
        }
        if (countDiagonals) {
            if ((toX[i] - fromX[i]).absoluteValue == (toY[i] - fromY[i]).absoluteValue) {
                for (j in getRange(0, xMax - xMin)) {
                    val toFromXSign = (toX[i] - fromX[i]) / (toX[i] - fromX[i]).absoluteValue
                    val toFromYSign = (toY[i] - fromY[i]) / (toY[i] - fromY[i]).absoluteValue
                    cloud[fromX[i] + j * toFromXSign][fromY[i] + j * toFromYSign] += 1
                }
            }
        }
    }
    return cloud
}