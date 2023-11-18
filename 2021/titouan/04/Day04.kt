package day4

import readInput

fun main() {

    fun playBingoToWin(boards: List<Board>, numbersToDraw: List<Int>): Int {
        val bestScore = boards.maxOf { it.score }
        if (bestScore > 0) return bestScore

        return playBingoToWin(
            boards.map { it.drawNumber(numbersToDraw.first()) },
            numbersToDraw.subList(1, numbersToDraw.size)
        )
    }

    fun playBingoToLoose(boards: List<Board>, numbersToDraw: List<Int>, lastWinningBoard: Board?): Int {
        if (lastWinningBoard != null && (numbersToDraw.isEmpty() || boards.isEmpty())) return lastWinningBoard.score

        if (boards.size == 1 && boards.first().score > 0) return boards.first().score

        val boardsAfterNewDraw = boards.map { it.drawNumber(numbersToDraw.first()) }

        return playBingoToLoose(
            boardsAfterNewDraw.filter { it.score < 0 },
            numbersToDraw.subList(1, numbersToDraw.size),
            boardsAfterNewDraw.firstOrNull { it.score > 0 } ?: lastWinningBoard
        )
    }

    fun part1(input: List<String>): Int {
        val numbersToDraw = input.first().split(",").map { it.toInt() }
        val boards = Board.from(input.subList(1, input.size))

        return playBingoToWin(boards, numbersToDraw)
    }

    fun part2(input: List<String>): Int {
        val numbersToDraw = input.first().split(",").map { it.toInt() }
        val boards = Board.from(input.subList(1, input.size))

        return playBingoToLoose(boards, numbersToDraw, null)
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput("day4/Day04_test")
    check(part1(testInput) == 4512)
    check(part2(testInput) == 1924)

    val input = readInput("day4/Day04")
    println(part1(input))
    println(part2(input))
}

data class Board(
    private val matrix: List<List<BoardBox>>,
    private val lastDrawnNumber: Int
) {

    val score: Int
        get() {
            val hasOneCompleteRow = List(matrix.size) { columnNumber ->
                matrix.map { it[columnNumber] }.all { it.isMarked }
            }.any { it }

            val hasOneCompleteLine = matrix.any { line -> line.all { it.isMarked } }
            return if (hasOneCompleteLine || hasOneCompleteRow) {
                lastDrawnNumber * matrix.flatten()
                    .filter { !it.isMarked }
                    .sumOf { it.number }
            } else -1
        }

    fun drawNumber(number: Int): Board = copy(
        matrix =
        matrix.map { line ->
            line.map { it.copy(isMarked = it.isMarked || it.number == number) }
        },
        lastDrawnNumber = number
    )

    companion object {
        private fun from(matrix: List<List<Int>>) =
            Board(
                matrix.map { line -> line.map { BoardBox(it) } },
                -1
            )

        fun from(inputStrings: List<String>): List<Board> = inputStrings
            .windowed(6, 6) {
                it.takeLast(5)
                    .map { line ->
                        line.trim()
                            .replace("  ", " ")
                            .split(" ")
                            .map { number -> number.toInt() }
                    }
            }.map { from(it) }

    }

    override fun toString(): String {
        return "${matrix.joinToString("\n")}\n"
    }
}

data class BoardBox(
    val number: Int,
    val isMarked: Boolean = false
) {

    override fun toString(): String =
        if (isMarked) "($number)" else "$number"

}
