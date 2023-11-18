package dayone

import java.io.File

fun main(args: Array<String>) {
    val depths = File("src/daytwo.main/kotlin/dayone/input.txt").readLines().map(String::toInt)
    println(part1(depths))
    println(part2(depths))
}

fun part1(input: List<Int>): Int {
    var returnValue = 0
    input.forEachIndexed { index, depth ->
        if (index > 0 && depth > input[index - 1]) {
            returnValue++
        }
    }

    return returnValue
}

fun part2(input: List<Int>): Int {
    var returnValue = 0
    var previousTripletSum= 0

    for (i in 0..input.size-3) {
        val currentTripletSum = input[i] + input[i+1] + input[i+2]

        if (i > 0 && currentTripletSum > previousTripletSum) {
            returnValue++
        }
        previousTripletSum = currentTripletSum
    }

    return returnValue
}