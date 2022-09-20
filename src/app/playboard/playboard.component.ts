import { Component, Directive, HostListener, OnInit } from '@angular/core';
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
  currentBoard: CandidateSquare[][]
  initialBoard: Square[][]
  highlightX: number = -1
	highlightY: number = -1
  headerText: string
  isSolving: boolean
  isFetching: boolean
  isWin: boolean

  constructor (public sudoku: SudokuService, private db: AngularFireDatabase, public router: Router) { }
  
  ngOnInit(): void {
    this.isFetching = true
    this.getBoard()
  }
  selectSquare(value: { x: number, y: number }) {
    this.highlightX = value.x
    this.highlightY = value.y
  }
  getBoard() {
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
      this.isFetching = false
    })
  }

  initBoard() {
    this.lockBoard(2) // TODO difficulty
    this.isFetching = false
    this.clearBoard()
  }

  lockBoard(n: number) {
    for (let y = 0; y < 9; y++) {
      const col = Array.from(Array(9).keys())
      for (let i = 0; i < n; i++) {
        const selectedSquare = col.splice(Math.floor(Math.random() * col.length), 1)[0]
        this.currentBoard[y][selectedSquare].locked = true
      }
    }
  }

  clearBoard() {
    this.isWin = false
    this.currentBoard.forEach((row) => {
      row.forEach((col) => {
        if (!col.locked) {
          col.value = null
        }
        col.invalid = false
      })
    })
  }

  async solveBoard() {
    this.highlightX = -1
    this.highlightY = -1
    this.isSolving = true
    await this.solveSquare(0, 0, this.currentBoard[0][0].value, this.initialBoard[0][0].value)
    this.isSolving = false
    this.isWin = true
  }

  async solveSquare(x: number, y: number, currentNum: SudokuValue, targetNum: SudokuValue): Promise<void> {
    if (!this.currentBoard[y][x].locked) {
      if (currentNum !== targetNum) {
        this.currentBoard[y][x].value = currentNum === 9 ? 1 : (currentNum ?? 0) + 1
        await new Promise(resolve => setTimeout(resolve, 25))
        if (this.currentBoard[y][x].value !== targetNum) {
          return this.solveSquare(x, y, this.currentBoard[y][x].value, targetNum)
        }
      }
    }
    if (x === 8 && y === 8) return 
    const nextX = x === 8 ? 0 : x + 1
    const nextY = x === 8 ? y + 1 : y
    return this.solveSquare(nextX, nextY, this.currentBoard[nextY][nextX].value, this.initialBoard[nextY][nextX].value)
  }

  updateLegalMoves(y: number, x: number) {
    const row = this.sudoku.getRow(this.currentBoard, y);
    const col = this.sudoku.getCol(this.currentBoard, x);
    const tiles = this.sudoku.getSubGrid(this.currentBoard, y, x); // TODO rename subgrid to tiles it sounds better
    [...row, ...col, ...tiles].forEach((square, i, squares) => {
      this.currentBoard[y][x].invalid = !this.sudoku.isMoveLegal(square, i, squares)
    })
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown({ key }: KeyboardEvent) {
    if (!this.isFetching) {
      switch (key) {
        case 'ArrowUp':
          this.highlightY = this.highlightY === -1 ? 0 : this.highlightY === 0 ? 8 : this.highlightY - 1
          break
        case 'ArrowDown':
          this.highlightY = this.highlightY === -1 ? 0 : this.highlightY === 8 ? 0 : this.highlightY + 1
          break
        case 'ArrowRight':
          this.highlightX = this.highlightX === -1 ? 0 : this.highlightX === 8 ? 0 : this.highlightX + 1
          break
        case 'ArrowLeft':
          this.highlightX = this.highlightX === -1 ? 0 : this.highlightX === 0 ? 8 : this.highlightX - 1
          break
        case 'Backspace':
          this.currentBoard[this.highlightY][this.highlightX].value = null
          this.updateLegalMoves(this.highlightY, this.highlightX)
          break
        default:
          const numInput = parseInt(key)
          if (isNaN(numInput) || numInput === 0) return
          // Candidate Mode
          console.log(numInput)
          this.currentBoard[this.highlightY][this.highlightX].value = numInput
          this.updateLegalMoves(this.highlightY, this.highlightX)
      }
    }
  }
}
