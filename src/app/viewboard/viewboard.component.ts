import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SudokuService } from 'src/services/sudoku.service';
import { ViewBoardStates } from 'src/types';

@Component({
  selector: 'viewboard',
  templateUrl: './viewboard.component.html',
  styleUrls: ['./viewboard.component.css']
})
export class ViewboardComponent implements OnInit {
  headerText: string = "Generate"
  state: string = ViewBoardStates.Empty

  constructor(public sudoku: SudokuService, private db: AngularFireDatabase) { }

  ngOnInit(): void {

  }

  clearBoard(): void {
    this.sudoku.clearBoard()
    this.state = ViewBoardStates.Empty
  }

  generateBoard(): void {
    this.state = ViewBoardStates.Generating
    this.sudoku.generateBoard().then((result) => this.state = result ? ViewBoardStates.Full : ViewBoardStates.None)
  }

  saveBoard(): void {
    const ref = this.db.list('boards')
    ref.push(this.sudoku.squares).then(() => {
      this.state = ViewBoardStates.Full
    }).catch((error) => {
      console.error(error);
      this.state = ViewBoardStates.Full
    })
  }
}
