# AdventOfCode2021

Advent of code 2021 participation : https://adventofcode.com/

# How to use

## Install Deno

Shell (Mac, Linux):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

PowerShell (Windows):

```powershell
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

[Homebrew](https://formulae.brew.sh/formula/deno) (Mac):

```sh
brew install deno
```

[Chocolatey](https://chocolatey.org/packages/deno) (Windows):

```powershell
choco install deno
```

[Scoop](https://scoop.sh/) (Windows):

```powershell
scoop install deno
```

## Run a solution for a day

Simply replace day by the day you want

```sh
deno run -A <day>/main.ts
```

## Run the tests for every AdventOfCode days

At the project root launch:

```sh
deno test -A
```

If you want to launch tests in watch mode, at the project root launch :

```sh
deno test -A --watch
```
