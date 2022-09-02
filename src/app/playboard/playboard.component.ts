import { Component, Directive, HostListener, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SudokuService } from 'src/services/sudoku.service';
import { CandidateSquare, Square } from 'src/types';
@Component({
  selector: 'playboard',
  templateUrl: './playboard.component.html',
  styleUrls: ['./playboard.component.css']
})
export class PlayboardComponent implements OnInit {
  currentBoard: CandidateSquare[][]
  headerText: string
  isSolving: boolean
  isFetching: boolean
  isWin: boolean

  constructor (public sudoku: SudokuService, private db: AngularFireDatabase, public router: Router) { }
  
  ngOnInit(): void {
    this.sudoku.highlightX = 4
    this.sudoku.highlightY = 4
    this.isFetching = true
    this.getPlayableBoardFromDatabase()
  }

  getPlayableBoardFromDatabase() {
    let ref = this.db.list<Square[][]>('boards')    
    ref.valueChanges().subscribe((data) => {
      this.currentBoard = data[Math.floor(Math.random() * data.length)].map((row): CandidateSquare[] => row.map((square): CandidateSquare => {
        return {
          value: square.value,
          invalid: false,
          locked: false,
          possibleValues: []
        }
      }))
      console.log(this.currentBoard);
      this.isFetching = false

    })
  }


  @HostListener('window:keydown', ['$event'])
  onKeyDown({ key }: KeyboardEvent) {
    if (!this.isFetching) {
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
          this.sudoku.squares[this.sudoku.highlightY][this.sudoku.highlightX].value = null
          break
        default:
          const numInput = parseInt(key)
          if (isNaN(numInput) || numInput === 0) return
          console.log(numInput)
          this.sudoku.squares[this.sudoku.highlightY][this.sudoku.highlightX].value = numInput
      }
    }
  }
}
