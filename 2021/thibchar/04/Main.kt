package dayfour

import java.io.File

fun main(args: Array<String>) {
    val input = File("src/main/kotlin/dayfour/input.txt").readLines()
    val values = input[0].split(",").map(String::toInt)
    val boards = getBoards(input).toMutableList()

    println("Part 1 puzzle value is : ${part1(values, boards)}")
    println("Part 2 puzzle value is : ${part2(values, boards)}")
}

fun part1(inputValues: List<Int>, boards: List<Board>): Int {
    inputValues.forEach { value ->
        boards.forEach { board ->
            board.markNumber(value)
            if (board.isBoardVictorious()) {
                return board.calculateUnmarkedSum() * value
            }
        }
    }
    return 0
}

fun part2(inputValues: List<Int>, boards: MutableList<Board>): Int {
    var boardsToRemove: MutableList<Board> = mutableListOf()
    inputValues.forEachIndexed { index, value ->
        if (index > 0 && boardsToRemove.isNotEmpty()) boards.removeAll(boardsToRemove)
        boards.forEach { board ->
            board.markNumber(value)
            if (board.isBoardVictorious()) {
                board.hasWon = true
                boardsToRemove.add(board)
                if (boards.size == 1) return board.calculateUnmarkedSum() * value
            }
        }
    }
    return 0
}

fun getBoards(input: List<String>): List<Board> {
    val boards = mutableListOf<Board>()
    val rows = mutableListOf<List<Number>>()
    for (i in 2 until input.size) {
        if (input[i].isBlank() || input[i].isEmpty()) {
            boards.add(Board(i, rows.toMutableList(), false))
            rows.clear()
        } else {
            rows.add(input[i].split(" ").filter { it.isNotBlank() }.map { Number(it.toInt(), false) })
        }
    }
    if (rows.isNotEmpty()) boards.add(Board(input.size, rows.toMutableList(), false))

    return boards
}

data class Number(val value: Int, var marked: Boolean)

data class Board(val id: Int, val numbers: MutableList<List<Number>>, var hasWon: Boolean) {

    fun markNumber(value: Int) {
        numbers.flatten().find { it.value == value }?.marked = true
    }

    fun calculateUnmarkedSum(): Int {
        return numbers.flatten().filter { it.marked.not() }.sumOf { it.value }
    }

    fun isBoardVictorious(): Boolean {
        var returnValue = false
        for (i in 0 until numbers.size) {
            var previousMarked = false
            if (numbers[i].all { it.marked }) returnValue = true
            for (j in 0 until numbers[i].size) {
                if (previousMarked && numbers[j][i].marked && j == 4) returnValue = true
                previousMarked = numbers[j][i].marked && (previousMarked || j == 0)
            }
        }
        return returnValue
    }
}
