package day12

import readInput
import kotlin.collections.ArrayDeque

fun main() {

    fun String.isSmallCave() = this.lowercase() == this
    fun String.isBigCave() = this.uppercase() == this

    fun readInput(isTest: Boolean = false): Map<String, List<String>> =
        readInput("day12/Day12${if (isTest) "_test" else ""}")
            .map {
                val (start: String, dest: String) = it.split("-")
                listOf(start to dest, dest to start)
            }
            .flatten()
            .groupBy(keySelector = { it.first }, valueTransform = { it.second })

    fun dfs(
        u: String,
        v: String,
        graph: Map<String, List<String>>,
        visited: MutableList<String>,
        currentPath: ArrayDeque<String>,
        simplePaths: MutableList<List<String>>,
        canVisit: (visited: List<String>, node: String) -> Boolean
    ) {
        if (!canVisit(visited, u)) return

        visited.add(u)

        currentPath.addLast(u)
        if (u == v) {
            simplePaths.add(currentPath.toList())
            visited.remove(u)
            currentPath.removeLast()
            return
        }

        graph[u]?.let { neighbours ->
            for (next in neighbours) {
                dfs(next, v, graph, visited, currentPath, simplePaths, canVisit)
            }
        }

        currentPath.removeLast()
        visited.remove(u)
    }

    fun findAllPaths(
        graph: Map<String, List<String>>,
        canVisit: (visited: List<String>, node: String) -> Boolean
    ): List<List<String>> {
        val visitedList = mutableListOf<String>()
        val currentPath = ArrayDeque(listOf<String>())
        val simplePaths = mutableListOf<List<String>>()
        dfs("start", "end", graph, visitedList, currentPath, simplePaths, canVisit)
        return simplePaths
    }

    fun part2(input: Map<String, List<String>>): Int {
        val possiblePaths = findAllPaths(input) { visited, node ->
            if (node.isBigCave()) true
            else if ((node == "start" || node == "end") && visited.contains(node)) false
            else if (visited.groupBy { it }.count { (node, list) -> node.isSmallCave() && list.size > 1 } == 0) true
            else (visited.count { it == node } == 0)
        }
        return possiblePaths.size
    }

    fun part1(input: Map<String, List<String>>): Int {
        val possiblePaths = findAllPaths(input) { visited, node ->
            node.isBigCave() || !visited.contains(node)
        }
        return possiblePaths.size
    }

    // test if implementation meets criteria from the description, like:
    val testInput = readInput(true)
    check(part1(testInput) == 226)
    check(part2(testInput) == 3509)

    val input = readInput()
    println(part1(input))
    println(part2(input))
}