import { Injectable } from "@angular/core";
import { CandidateSquare } from "src/types/CandidateSquare";
import { Square } from "src/types/Square";
import { SudokuValue } from "src/types/SudokuValue";

@Injectable({
	providedIn: 'root'
})

export class SudokuService {
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
		return squares.some((sq2, i2) => i1 === i2 ? true : sq1.value === sq2.value)
	}
	getSubGrid<T>(board: T[][], x: number, y: number) {
		const subX = Math.floor(x / 3) * 3 
		const subY = Math.floor(y / 3) * 3
		const subGrid: T[] = []
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
		  const row = board[y]
		  if (row.some((square) => square.value === num)) return false
		  const col = board.map((row) => row[x])
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
		await new Promise(resolve => setTimeout(resolve, 10))
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
}