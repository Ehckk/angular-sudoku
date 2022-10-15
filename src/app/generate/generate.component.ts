import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { SudokuService } from 'src/services/sudoku.service';
import { BoardState } from 'src/types/BoardState';
import { GenerateState } from 'src/types/GenerateState';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
})
export class GenerateComponent implements OnInit {
  state: BoardState

  constructor(public sudoku: SudokuService, public db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.state = {
      mode: 'GENERATE',
      squares: this.sudoku.newBoard,
      status: GenerateState.Empty,
      highlightX: -1,
      highlightY: -1
    }
  }
  clearBoard(): void {
    this.state.squares.forEach((row) => row.forEach((col) => col.value = null))
    this.state.status = GenerateState.Empty
  }
  async generateBoard() {
    this.clearBoard()
    this.state.status = GenerateState.Generating
    const result = await this.sudoku.addNumbersToRow(this.state.squares, this.sudoku.getShuffledNumbers(), 0, 0) ?? false
    console.log(`${result ? `Successfully generated` : `Failed to generate`} board`)
    this.state.status = result ? GenerateState.Full : GenerateState.Error 
  }
  saveBoard(): void {
    this.state.status = GenerateState.Saving
    const ref = this.db.list('boards')
    ref.push(this.state.squares).catch() // TODO alert system?
    this.state.status = GenerateState.Full
  }
}
