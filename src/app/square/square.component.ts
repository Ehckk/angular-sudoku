import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';
import { SudokuValue } from 'src/types/SudokuValue';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() mode: 'GENERATE' | 'PLAY'
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue
  @Input() locked: boolean
  @Input() selected: boolean
  @Input() invalid: boolean
  @Output() squareClick = new EventEmitter<{ x: number, y: number }>()
  numbers = Array.from(Array(9).keys()).map((n) => n + 1)

  constructor(public sudoku: SudokuService) { }

  ngOnInit(): void {
    // this.sudoku.getPossibleNumbers(currentBoard, null, y, x)
  }
}
