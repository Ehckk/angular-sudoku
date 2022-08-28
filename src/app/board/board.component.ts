import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SudokuService } from 'src/services/sudoku.service';
import { GameMode, ControlNames, Square } from 'src/types';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  mode: GameMode = 'Generate'
  isEmpty: boolean = true
  isGenerating: boolean = false
	isSaving: boolean = false
	isReset: boolean = false
	isFetching: boolean = false
	isSolving: boolean = false
  isWin: boolean = false
  boards: Observable<Square[]> // TODO lol
  
  constructor (public sudoku: SudokuService, private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    const key = this.router.url.slice(1)
    switch (key) {
      case 'generate':
        this.mode = 'Generate'
        this.sudoku.clearBoard()
        break;
      case 'play':
        this.mode = 'Play'
        this.sudoku.clearBoard()
        break;
    }
  }

  squareClicked(y: number, x: number) {
    // TODO: reverse mode
    if (this.mode === 'Generate') return 
    // TODO if increment | decrement idk some tstype
    this.sudoku.incrementSquare(y, x)
  }

  handleClick(control: ControlNames) {
    switch (control) {
      case 'Clear':
        this.isEmpty = true
        this.sudoku.clearBoard() 
        break;
      case 'Generate':
        this.isEmpty = false
        this.isWin = false
        this.isGenerating = true
        this.sudoku.generateBoard().then((result) => {
          this.isGenerating = false
          this.isWin = result
        })
        break;
      case 'Save':
        this.isSaving = true
        const ref = this.db.list('boards')
        ref.push(this.sudoku.boardMap).then((res) => {
          console.log(res);
          this.isSaving = false
        }).catch((error) => {
          console.error(error);
        })
        break;
      case 'Reset':
        break;
      case 'New Game':
        break;
      case 'Give Up':
        break;
    }
  }
}
