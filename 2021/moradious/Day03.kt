
fun main() {

    fun part1(input: List<String>) {
        var gammaRate = ""
        var column: List<Char>

        for (index in input[0].indices) {
            column = input.map { it[index] }
            val digit = if (column.count { it == '0' } > (column.size / 2)) '0' else '1'
            gammaRate += digit
        }

        val epsilonRate = gammaRate
            .toCharArray()
            .map { if (it == '0') '1' else '0' }
            .joinToString("")

        val gammaRateInteger = Integer.parseInt(gammaRate, 2)
        val epsilonRateInteger = Integer.parseInt(epsilonRate, 2)

        println("Result : " + gammaRateInteger * epsilonRateInteger)
    }

    val testInput = readInput("Day03_data")
    part1(testInput)
}


