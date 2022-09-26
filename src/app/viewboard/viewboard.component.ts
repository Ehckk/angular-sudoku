import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SudokuService } from 'src/services/sudoku.service';
import { Square, ViewBoardStates } from 'src/types';

@Component({
  selector: 'viewboard',
  templateUrl: './viewboard.component.html',
  styleUrls: ['./viewboard.component.css']
})
export class ViewboardComponent implements OnInit {
  headerText: string = "Generate"
  state: string
	board: Square[][]

  constructor(public sudoku: SudokuService, private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.emptyBoard()
  }

  clearBoard() { 
    this.board = this.sudoku.newBoard
  }

  emptyBoard(): void {
    this.state = ViewBoardStates.Empty
    this.clearBoard()
  }

  async generateBoard() {
    this.clearBoard()
    this.state = ViewBoardStates.Generating
    const result = await this.sudoku.addNumbersToRow(this.board, this.sudoku.getShuffledNumbers(), 0, 0) ?? false
    console.log(`${result ? `Successfully generated` : `Failed to generate`} board`)
    this.state = result ? ViewBoardStates.Full : ViewBoardStates.None
  }

  saveBoard(): void {
    if (ViewBoardStates.None) return // TODO pop up
    this.state = ViewBoardStates.Saving
    const ref = this.db.list('boards')
    ref.push(this.board).then(() => {
      this.state = ViewBoardStates.Full
    }).catch((error) => {
      console.error(error);
      this.state = ViewBoardStates.Full
    })
  }
}
