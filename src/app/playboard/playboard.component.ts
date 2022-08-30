import { Component, OnInit } from '@angular/core';
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
}
