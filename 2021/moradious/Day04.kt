
var winnerBoards = mutableListOf<Pair<String, List<List<Number>>>>()
fun main() {

    fun part1(numbers: List<String>, boards: MutableList<List<List<Number>>>) {

        run loop@{
            val flattenBoards = boards.flatten().flatten()
            numbers.forEach { number ->
                flattenBoards.forEach {
                    if (it.value == number) it.marked = true
                }
                if (checkCompleteRowOrColumn(number, boards, true)) return@loop
            }
        }
        computeBoard(winnerBoards.first().first, winnerBoards.first().second)
    }

    fun part2(numbers: List<String>, boards: MutableList<List<List<Number>>>) {

        run loop@{
            numbers.forEach { number ->
                boards.flatten().flatten().forEach {
                    if (it.value == number) it.marked = true
                }
                checkCompleteRowOrColumn(number, boards, false)
                boards -= winnerBoards.map{ it.second }.toSet()
            }
        }
        computeBoard(winnerBoards.last().first, winnerBoards.last().second)
    }

    val testInput = readInput("Day04_data")
    val numbers = testInput[0].split(",")
    val boards = getBoards(testInput)
    part1(numbers, boards)
    winnerBoards.clear()
    part2(numbers, boards)
}

data class Number(val value: String, var marked: Boolean)

private fun getBoards(testInput: List<String>): MutableList<List<List<Number>>> {
    val boards = mutableListOf<List<List<Number>>>()
    val board = mutableListOf<List<Number>>()
    for (i in 2 until testInput.size) {
        if (testInput[i].isNotEmpty()) {
            board.add(
                testInput[i].split(" ").filter { it.isNotBlank() }.map { Number(it, false) }
            )
        } else {
            boards.add(board.map {it})
            board.clear()
        }
    }

    return boards
}

fun checkCompleteRowOrColumn(
    numberEntry: String,
    boards: MutableList<List<List<Number>>>,
    isPart1: Boolean): Boolean {

    boards.forEachIndexed { index, board ->
        board.forEach { row ->
            if (isWinningBoard(numberEntry, board, row)) {
                if (isPart1) return true else return@forEachIndexed
            }
        }

        for (i in 0..4) {
            val column = board.map { it[i] }
            if (isWinningBoard(numberEntry, board, column)) {
                if (isPart1) return true else return@forEachIndexed
            }
        }
    }

    return false
}

fun isWinningBoard(
    numberEntry: String,
    board: List<List<Number>>,
    rowOrColumn: List<Number>,
): Boolean {
    var isFinished = true
    rowOrColumn.forEach inner@{ number ->
        if (number.marked) {
            return@inner
        } else {
            isFinished = false
        }
    }

    if (isFinished) {
        winnerBoards.add(Pair(numberEntry, board))
        return true
    }

    return false
}

fun computeBoard(numberEntry: String, board: List<List<Number>>) {
    val unMarked = board
        .flatten()
        .filter { !it.marked }
        .map { it.value.toInt()}
        .fold(0) { acc, number ->  acc + number}

    val score = unMarked * numberEntry.toInt()
    println("Score : $score")
}
