import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SudokuService } from 'src/services/sudoku.service';
import { BoardState } from 'src/types/BoardState';
import { CandidateSquare } from 'src/types/CandidateSquare';
import { PlayState } from 'src/types/PlayState';
import { Square } from 'src/types/Square';
import { SudokuValue } from 'src/types/SudokuValue';

@Component({
  selector: 'play',
  templateUrl: './play.component.html',
})
export class PlayComponent implements OnInit {
  state: BoardState

  constructor(public sudoku: SudokuService, public db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.state = {
      mode: 'PLAY',
      squares: [],
      initial: [],
      status: PlayState.Fetching,
      highlightX: 0,
      highlightY: 0
    }
    this.getBoard()
  }
  getBoard() {
    let ref = this.db.list<Square[][]>('boards')    
    ref.valueChanges().subscribe((data) => {
      if (this.state.mode === 'GENERATE') return
      this.state.initial = data[Math.floor(Math.random() * data.length)].map((row): Square[] => row.map((square): Square => square))
      this.state.squares = this.state.initial.map((row): CandidateSquare[] => row.map((square): CandidateSquare => {
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
  lockBoard(n: number) {
    for (let y = 0; y < 9; y++) {
      const col = Array.from(Array(9).keys())
      for (let i = 0; i < n; i++) {
        const selectedSquare = col.splice(Math.floor(Math.random() * col.length), 1)[0];
        (this.state.squares as CandidateSquare[][])[y][selectedSquare].locked = true
      }
    }
  }
  initBoard() {
    this.lockBoard(2) // TODO difficulty
    this.state.status = PlayState.Reset
    this.clearBoard()
  }
  clearBoard() {
    if (this.state.mode === 'PLAY') {
      this.state.squares.forEach((row) => {
        row.forEach((col) => {
          !col.locked ? col.value = null : {}
          col.invalid = false
        })
      })
    } else {
      this.state.squares.forEach((row) => row.forEach((col) => col.value = null))
    }
  }
  async solveBoard() {
    if (this.state.mode === 'GENERATE') return
    this.state.highlightX = -1
    this.state.highlightY = -1
    this.state.status = PlayState.Solving
    await this.solveSquare(0, 0, this.state.squares[0][0].value, this.state.initial[0][0].value)
    this.state.status = PlayState.Win
  }
  async solveSquare(x: number, y: number, current: SudokuValue, target: SudokuValue): Promise<void> {
    if (!(this.state.squares as CandidateSquare[][])[y][x].locked) {
      if (current !== target) {
        this.state.squares[y][x].value = current === 9 ? 1 : (current ?? 0) + 1
        await new Promise(resolve => setTimeout(resolve, 10))
        if (this.state.squares[y][x].value !== target) {
          return this.solveSquare(x, y, this.state.squares[y][x].value, target)
        }
      }
    }
    if (x === 8 && y === 8) return 
    const nextX = x === 8 ? 0 : x + 1
    const nextY = x === 8 ? y + 1 : y
    return this.solveSquare(nextX, nextY, this.state.squares[nextY][nextX].value, this.state.squares[nextY][nextX].value)
  }
  updateMoves() {
    if (this.state.mode === 'GENERATE') return
    const row = this.state.squares[this.state.highlightY]
    row.forEach((square, i) => {
      square.invalid = square.value ? !this.sudoku.isMoveLegal(square, this.state.highlightY, row) : false
    })
    const col = this.state.squares.map((row) => row[this.state.highlightX])
    col.forEach((square) => {
      square.invalid = square.value ? !this.sudoku.isMoveLegal(square, this.state.highlightX, col) : false
    })
    const tiles = this.sudoku.getSubGrid(this.state.squares, this.state.highlightX, this.state.highlightY)
    tiles.forEach((square) => {
      square.invalid = square.value ? !this.sudoku.isMoveLegal(square, (this.state.highlightX % 3) + (this.state.highlightY % 3), tiles) : false
    })
    return true
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown({ key }: KeyboardEvent) {
    if (this.state.status === PlayState.Fetching) return
    switch (key) {
      case 'ArrowUp':
        this.state.highlightY = this.state.highlightY === -1 ? 0 : this.state.highlightY === 0 ? 8 : this.state.highlightY - 1
        break
      case 'ArrowDown':
        this.state.highlightY = this.state.highlightY === -1 ? 0 : this.state.highlightY === 8 ? 0 : this.state.highlightY + 1
        break
      case 'ArrowRight':
        this.state.highlightX = this.state.highlightX === -1 ? 0 : this.state.highlightX === 8 ? 0 : this.state.highlightX + 1
        break
      case 'ArrowLeft':
        this.state.highlightX = this.state.highlightX === -1 ? 0 : this.state.highlightX === 0 ? 8 : this.state.highlightX - 1
        break
      case 'Backspace':
        this.state.squares[this.state.highlightY][this.state.highlightX].value = null
        this.updateMoves()
        break
      default:
        if ((this.state.squares as CandidateSquare[][])[this.state.highlightY][this.state.highlightX].locked) return
        const input = parseInt(key)
        if (isNaN(input) || input === 0) return
        // Candidate Mode
        console.log(input)
        this.state.squares[this.state.highlightY][this.state.highlightX].value = input
        this.updateMoves()
    }
  }
}
