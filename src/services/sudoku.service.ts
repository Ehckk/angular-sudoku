import { Injectable } from "@angular/core";
import { CandidateSquare, Difficulty, Square, SudokuValue } from "src/types";

@Injectable({
	providedIn: 'root'
})

export class SudokuService {
	isWon: boolean
	auto: boolean = false
	// highlightX
	// highlightY // Move it back here

	get newBoard(): Square[][] {
		return (Array(9).fill(null).map((row) => Array(9).fill(null)) as SudokuValue[][]).map((row) => row.map((s) => {
			return { value: s }
		}))
	}

	getShuffledNumbers(): number[] {
		const numbers = Array.from(Array(9).keys()).map((n) => n + 1)
		const shuffledNumbers: number[] = []
		while (numbers.length > 0) {
			shuffledNumbers.push(...numbers.splice(Math.floor(Math.random() * numbers.length), 1))
		}
		return shuffledNumbers
	}

	isMoveLegal(sq1: Square, i1: number, squares: Square[]) {
		if (sq1.value === null) return true
		return squares.some((sq2, i2) => {
			if (i1 === i2) return true
			return sq1.value === sq2.value
		})
	}

	getRow(board: Square[][], y: number) {
		return board[y]
	}

	getCol(board: Square[][], x: number) {
		return board.map((row) => row[x])
	}

	getSubGrid(board: Square[][], x: number, y: number) {
		const subX = Math.floor(x / 3) * 3 
		const subY = Math.floor(y / 3) * 3
		const subGrid: Square[] = []
		for (let i = subY; i < subY + 3; i++) {
			for (let j = subX; j < subX + 3; j++) {
				if (i !== y && j !== x) { // TODO 🥶
					subGrid.push(board[i][j])
				}
			}
		}
		return subGrid
	}

	getPossibleNumbers(board: Square[][], numbers: number[] | null, y: number, x: number) {
		if (numbers === null) {
			numbers = Array.from(Array(9).keys()).map((n) => n + 1)
		}
		return numbers.filter((num) => {
		  const row = this.getRow(board, y)
		  if (row.some((square) => square.value === num)) return false
		  const col = this.getCol(board, x)
		  if (col.some((square) => square.value === num)) return false
		  const tiles = this.getSubGrid(board, x, y)
		  if (tiles.some((square) => square.value === num)) return false
		  return true
		})
	  }

	async addNumbersToRow(board: Square[][], numbers: number[], y: number, x: number): Promise<boolean | void> {
		if (numbers.length === 0) {
			return false
		}
		const newNumbers = this.getPossibleNumbers(board, numbers, y, x)
		if (newNumbers.length === 0) {
			return false
		}
		board[y][x].value = newNumbers.splice(0, 1)[0]
		await new Promise(resolve => setTimeout(resolve, 25))
		if (y === 8 && x === 8) {
			return true
		}
		const newX = x === 8 ? 0 : x + 1
		const newY = x === 8 ? y + 1 : y
		const solved = await this.addNumbersToRow(board, this.getShuffledNumbers(), newY, newX) ?? false
		if (solved) {
			return true
		}
		if (newNumbers.length > 0) {
			return this.addNumbersToRow(board, newNumbers, y, x)
		}
		board[y][x].value = null
		return false
	}

	toggleAuto() { // TODO wut
		this.auto = !this.auto
	}

	incrementSquare(board: Square[][], y: number, x: number) {
		// TODO reverse mode based on switch or keyboard input
		let currentValue = board[y][x].value
		switch (true) {
			case currentValue === null:
				board[y][x].value = 1
				break;
			case currentValue === 9:
				board[y][x].value = null
				break;
			default:
				board[y][x].value = (currentValue ?? 1) + 1
				break;
		}
		// this.updateSquares()
	}

	decrementSquare(board: Square[][], y: number, x: number) {
		// TODO lol
		let currentValue = board[y][x].value
		switch (true) {
			case currentValue === null:
				board[y][x].value = 9
				break;
			case currentValue === 1:
				board[y][x].value = null
				break;
			default:
				board[y][x].value = (currentValue ?? 9) - 1
				break;
		}
	}
}