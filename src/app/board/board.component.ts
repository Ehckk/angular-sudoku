import { Component, HostListener, Input, OnInit } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';
import { BoardState } from 'src/types/BoardState';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  @Input() state: BoardState

  constructor (public sudoku: SudokuService) { }

  selectSquare(value: { x: number, y: number }) {
    if (this.state.mode === 'GENERATE') return
    this.state.highlightX = value.x
    this.state.highlightY = value.y
  }
}
