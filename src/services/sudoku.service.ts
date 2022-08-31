import { Injectable } from "@angular/core";
import { Difficulty, Square, SudokuValue } from "src/types";

@Injectable({
	providedIn: 'root'
})

export class SudokuService {
	squares: Square[][] = this.newBoard
	isWon: boolean
	
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

	validMove(num: SudokuValue, x: number, y: number): boolean {
		const row = this.squares[y]
		if (row.some((v, i) => i !== x && v.value === num)) { // number in row
			return false
		}
		const col = this.squares.map((row) => row[x])
		if (col.some((v, i) => i !== y && v.value === num)) { // number in column
			return false
		}
		const subX = Math.floor(x / 3) * 3 
		const subY = Math.floor(y / 3) * 3
		const subGrid: SudokuValue[] = []
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
		await new Promise(resolve => setTimeout(resolve, 25))
		if (y === 8 && x === 8) {
			return true
		}
		const newX = x === 8 ? 0 : x + 1
		const newY = x === 8 ? y + 1 : y
		const solved = await this.addNumbersToRow(this.getShuffledNumbers(), newY, newX)
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
		switch (true) {
			case currentValue === null:
				this.squares[y][x].value = 1
				break;
			case currentValue === 9:
				this.squares[y][x].value = null
				break;
			default:
				this.squares[y][x].value = (currentValue ?? 1) + 1
				break;
		}
		// this.updateSquares()
	}

	decrementSquare(y: number, x: number) {
		// TODO lol
		let currentValue = this.squares[y][x].value
		switch (true) {
			case currentValue === null:
				this.squares[y][x].value = 9
				break;
			case currentValue === 1:
				this.squares[y][x].value = null
				break;
			default:
				this.squares[y][x].value = (currentValue ?? 9) - 1
				break;
		}
		// this.updateSquares()
		// if (currentValue === null) {
		// 	this.squares[y][x].invalid = false
		// }
		// this.squares[y][x].invalid = !this.validMove(this.squares[y][x].value, x, y)
	}




	// async formatBoard(board: Square[][], difficulty: Difficulty): Promise<boolean | void> {
	// 	// difficulty
	// 	const boardCopy = [...board]
	// 	this.squares = boardCopy
	// 	await this.lockGrids(boardCopy, 0, Difficulty.Easy, Array.from(Array(9).keys()))
	// 	// await this.resetBoard()
	// 	console.log('locked');
	// 	return 
	// }
	// async lockGrids(board: Square[][], lockCount: number, difficulty: number, targets: number[]): Promise<boolean | void> {
	// 	if (lockCount === difficulty * 9) {
	// 		return true
	// 	}
	// 	if (targets.length === 0) {
	// 		return false
	// 	}
	// 	const target = lockCount % 9
	// 	const targetIndex = targets.splice(Math.floor(Math.random() * targets.length), 1)[0]
	// 	board[target][targetIndex]		
	// 	if (board[target][targetIndex].locked) {
	// 		return await this.lockGrids(board, lockCount, difficulty, targets)
	// 	}
	// 	board[target][targetIndex].locked = true
	// 	if (await this.lockGrids(board, lockCount + 1, difficulty, (lockCount + 1) % 9 === 0 ? Array.from(Array(9).keys()) : targets)) {
	// 		return true
	// 	}
	// 	if (targets.length > 0) {
	// 		return await this.lockGrids(board, lockCount, difficulty, targets)
	// 	}
	// 	return false
	// }
	// updateSquares() {
	// 	this.squares.forEach((row, y) => {
	// 		row.forEach((square, x) => {
	// 			if (!square.locked) {
	// 				if (!square.value) {
	// 					square.invalid = false
	// 				} else {
	// 					square.invalid = !this.validMove(square.value, x, y)
	// 				}
	// 			}
	// 		})
	// 	})
	// }
	// async resetBoard() {
	// 	this.squares.forEach((row) => {
	// 		row.forEach((square) => {
	// 			if (!square.locked) {
	// 				square.value = null
	// 				square.invalid = false
	// 			}
	// 		})
	// 	})
	// }
	// async giveUp(board: Square[][]) {
	// 	console.log(board)
	// 	board.forEach((row, y) => {
	// 		row.forEach(async (square, x) => {
	// 			if (!square.locked) {
	// 				await new Promise(resolve => setTimeout(resolve, 10))
	// 				this.squares[y][x] = board[y][x]
	// 			}
	// 		})
	// 	})
	// }
	// TODO newgame
}