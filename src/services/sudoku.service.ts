import { Injectable } from "@angular/core";
import { Square, SudokuValue } from "src/types";

@Injectable({
	providedIn: 'root'
})
export class SudokuService {
	squares: Square[][] = this.newBoard
	isWon: boolean
	
	get newBoard(): Square[][] {
		return (Array(9).fill(null).map((row) => Array(9).fill(null)) as SudokuValue[][]).map((row) => row.map((s) => {
			return {
				value: s,
				current: false,
				invalid: false,
				canEdit: false, 
			}
		}))
	}

	get boardMap(): Square[] {
		return this.squares.reduce((prev, current) => prev.concat(current))
	}

	getShuffledNumbers(): number[] {
		const numbers = Array.from(Array(9).keys()).map((n) => n + 1)
		const shuffledNumbers: number[] = []
		while (numbers.length > 0) {
			shuffledNumbers.push(...numbers.splice(Math.floor(Math.random() * numbers.length), 1))
		}
		return shuffledNumbers
	}

	validMove(num: SudokuValue, x: number, y: number): boolean {
		const row = this.squares[y]
		console.log(row);
		if (row.some((col) => col.value === num)) { // number in row
			return false
		}
		const col = this.squares.map((row) => row[x])
		console.log(col);
		if (col.some((i) => i.value === num)) { // number in column
			return false
		}
		const subX = Math.floor(x / 3) * 3 
		const subY = Math.floor(y / 3) * 3
		const subGrid: SudokuValue[] = []
		console.log(subGrid);
		for (let i = subY; i < subY + 3; i++) {
			for (let j = subX; j < subX + 3; j++) {
				if (i !== y && j !== x) { // TODO 🥶
					subGrid.push(this.squares[i][j].value)
				}
			}
		}
		if (subGrid.some((value) => value === num)) { // number in surrounding grid
			return false
		}
		return true
	}

	clearBoard() {
		this.squares = this.newBoard
	}

	async generateBoard(): Promise<boolean> {
		this.clearBoard()
		const result = await this.addNumbersToRow(this.getShuffledNumbers(), 0, 0).then((result) => {
			console.log(`${result ? `Successfully generated` : `Failed to generate`} board`)
			return result ?? false
		})
		return result
	}

	async addNumbersToRow(numbers: number[], y: number, x: number): Promise<boolean | void> {
		if (numbers.length === 0) {
			return false
		}
		const newNumbers = numbers.filter((num) => this.validMove(num, x, y))
		if (newNumbers.length === 0) {
			return false
		}
		this.squares[y][x].value = newNumbers.splice(0, 1)[0]
		if (y === 8 && x === 8) {
			return true
		} 
		await new Promise(resolve => setTimeout(resolve, 1))
		const solved = x === 8 ? await this.addNumbersToRow(this.getShuffledNumbers(), y + 1, 0) : await this.addNumbersToRow(this.getShuffledNumbers(), y, x + 1)
		if (solved) {
			return true
		}
		if (newNumbers.length > 0) {
			return await this.addNumbersToRow(newNumbers, y, x)
		}
		this.squares[y][x].value = null
		return false
	}

	setSquare(num: SudokuValue, y: number, x: number) {
		// TODO reverse mode based on switch or keyboard input
		this.squares[y][x].value = num
	}

	incrementSquare(y: number, x: number) {
		// TODO reverse mode based on switch or keyboard input
		let currentValue = this.squares[y][x].value
		this.squares[y][x].value = currentValue === null ? 1 : currentValue === 9 ? null : currentValue + 1
		this.squares[y][x].invalid = !this.validMove(this.squares[y][x].value, x, y)
	}

	decrementSquare(y: number, x: number) {
		// TODO lol
		let currentValue = this.squares[y][x].value
		this.squares[y][x].value = currentValue === null ? 9 : currentValue === 1 ? null : currentValue - 1
		this.squares[y][x].invalid = !this.validMove(this.squares[y][x].value, x, y)
	}

}