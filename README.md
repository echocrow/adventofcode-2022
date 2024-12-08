# Advent of Code Challenges

Contains personal solutions[^1] to the [Advent of Code](https://adventofcode.com/) puzzles.

- [2021](https://github.com/echocrow/advent-of-code/tree/main/src/events/2021)
- [2022](https://github.com/echocrow/advent-of-code/tree/main/src/events/2022)
- [2023](https://github.com/echocrow/advent-of-code/tree/main/src/events/2023)
- [2024](https://github.com/echocrow/advent-of-code/tree/main/src/events/2024)

[^1]: includes, but is not limited to, actual solutions, inefficient approaches, efficient hacks, botched algorithms, and _SoLuTiOnS_.

## Setup

```sh
# Install dependencies.
pnpm install

# Scaffold universal input & output files.
pnpm init
```

## Usage TL;DR

```sh
# Scaffold next day.
pnpm gen

# Run & watch changed tests…
pnpm test

# Run & watch latest part 1…
PART=1 pnpm watch:latest

# Run & watch latest part 2…
PART=2 pnpm watch:latest
```

## Usage

### Execution

Run a file with standard streams (stdin & stdout) instead of universal input/output files:

```sh
pnpm start ./scr/events/2023/25/1.ts
```

Run a file once:

```sh
FILE=src/events/2023/25/1.ts pnpm start:file
```

Run and watch a file:

```sh
FILE=src/events/2023/25/1.ts pnpm watch
```

Run and watch a part of the latest day:

```sh
PART=1 pnpm watch:latest
```

### Miscellaneous Scripts

Scaffold code for the next day:

```sh
pnpm gen
```

Run all tests:

```sh
pnpm test:all --bail 1
```

Run and watch tests of modified/uncommitted changes:

```sh
pnpm test
```

Format files:

```sh
pnpm format
```
