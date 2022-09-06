import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SudokuService } from 'src/services/sudoku.service';
import { CandidateSquare, Square, SudokuValue } from 'src/types';
@Component({
  selector: 'playboard',
  templateUrl: './playboard.component.html',
  styleUrls: ['./playboard.component.css']
})
export class PlayboardComponent implements OnInit {
  initialBoard: Square[][]
  currentBoard: CandidateSquare[][]
  headerText: string
  isSolving: boolean = false
  isFetching: boolean
  isWin: boolean = false
  candidateMode: boolean = false

  constructor (public sudoku: SudokuService, private db: AngularFireDatabase, public router: Router) { }
  
  ngOnInit(): void {
    this.getPlayableBoardFromDatabase()
  }

  async getPlayableBoardFromDatabase() {
    this.isFetching = true
    let ref = this.db.list<Square[][]>('boards')    
    ref.valueChanges().subscribe((data) => {
      this.initialBoard = data[Math.floor(Math.random() * data.length)].map((row): Square[] => row.map((square): Square => square))
      this.currentBoard = this.initialBoard.map((row): CandidateSquare[] => row.map((square): CandidateSquare => {
        return {
          value: square.value,
          invalid: false,
          locked: false,
          possibleValues: []
        }
      }))
      this.initBoard()
    })
  }

  initBoard() {
    this.lockSquares(2) // TODO difficulty
    this.isFetching = false
    this.clearBoard()
  }

  clearBoard() {
    this.isWin = false
    this.currentBoard.forEach((row) => {
      row.forEach((col) => {
        if (!col.locked) {
          col.value = null
        }
      })
    })
    this.updateBoard()
  }

  async solveBoard() {
    this.sudoku.highlightX = -1
    this.sudoku.highlightY = -1
    this.isSolving = true
    await this.solveSquare(0, 0, this.currentBoard[0][0].value, this.initialBoard[0][0].value)
    this.isSolving = false
    this.isWin = true
  }

  async solveSquare(x: number, y: number, currentNum: SudokuValue, targetNum: SudokuValue): Promise<void> {
    if (!this.currentBoard[y][x].locked) {
      if (currentNum !== targetNum) {
        this.currentBoard[y][x].value = currentNum === 9 ? 1 : (currentNum ?? 0) + 1
        this.updateBoard()
        await new Promise(resolve => setTimeout(resolve, 25))
        if (this.currentBoard[y][x].value  !== targetNum) {
          return await this.solveSquare(x, y, this.currentBoard[y][x].value, targetNum)
        }
      }
    }
    if (x === 8 && y === 8) {
      return
    }
    const nextX = x === 8 ? 0 : x + 1
    const nextY = x === 8 ? y + 1 : y
    const nextNum = this.currentBoard[nextY][nextX].value
    const nextTarget =  this.initialBoard[nextY][nextX].value
    return await this.solveSquare(nextX, nextY, nextNum, nextTarget)
  }

  lockSquares(n: number): void {
    this.currentBoard.forEach((row, y) => {
      const columns = Array.from(Array(9).keys())
      const selectedColumns: number[] = []
      for (let i = 0; i < n; i++) {
        selectedColumns.push(...columns.splice(Math.floor(Math.random() * columns.length), 1))
      }
      selectedColumns.forEach((x) => {
        this.currentBoard[y][x].locked = true
      })
    })
  }
  // toggleMode() {
  //   this.candidateMode = !this.candidateMode
  // }

	updateBoard() {
    this.currentBoard.forEach((row, y) => {
      row.forEach((col, x) => {
        col.invalid = !this.isMoveLegal(col.value, x, y)
      })
    })
    // TODO win condition
  }

  isMoveLegal(num: SudokuValue, x: number, y: number): boolean {
    if (num === null) return true
    const row = this.currentBoard[y]
    if (row.some((v, i) => i !== x && v.value === num)) return false // number in row
    const col = this.currentBoard.map((row) => row[x])
    if (col.some((v, i) => i !== y && v.value === num)) return false // number in column
    const subX = Math.floor(x / 3) * 3 
    const subY = Math.floor(y / 3) * 3
    const subGrid: SudokuValue[] = []
    for (let i = subY; i < subY + 3; i++) {
      for (let j = subX; j < subX + 3; j++) {
        if (i !== y && j !== x) { // TODO 🥶
          subGrid.push(this.currentBoard[i][j].value)
        }
      }
    }
    if (subGrid.some((value) => value === num)) return false // number in surrounding grid
    return true
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown({ key }: KeyboardEvent) {
    if (this.isFetching || this.isSolving) return
    switch (key) {
      case 'ArrowUp':
        this.sudoku.highlightY = this.sudoku.highlightY === -1 ? 0 : this.sudoku.highlightY === 0 ? 8 : this.sudoku.highlightY - 1
        break
      case 'ArrowDown':
        this.sudoku.highlightY = this.sudoku.highlightY === -1 ? 0 : this.sudoku.highlightY === 8 ? 0 : this.sudoku.highlightY + 1
        break
      case 'ArrowRight':
        this.sudoku.highlightX = this.sudoku.highlightX === -1 ? 0 : this.sudoku.highlightX === 8 ? 0 : this.sudoku.highlightX + 1
        break
      case 'ArrowLeft':
        this.sudoku.highlightX = this.sudoku.highlightX === -1 ? 0 : this.sudoku.highlightX === 0 ? 8 : this.sudoku.highlightX - 1
        break
      case 'Backspace':
        this.currentBoard[this.sudoku.highlightY][this.sudoku.highlightX].value = null
        this.updateBoard()
        break
      default:
        if (this.currentBoard[this.sudoku.highlightY][this.sudoku.highlightX].locked) return
        const numInput = parseInt(key)
        if (isNaN(numInput) || numInput === 0) return
        this.currentBoard[this.sudoku.highlightY][this.sudoku.highlightX].value = numInput
        this.updateBoard()
    }
  }
}
