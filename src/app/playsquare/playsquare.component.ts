import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'playsquare',
  templateUrl: './playsquare.component.html',
  styleUrls: ['./playsquare.component.css']
})
  // TODO
  // - candidate mode 
export class PlaysquareComponent {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue
  @Input() invalid: boolean
  @Input() selected: boolean
  @Input() locked: boolean
  @Input() possibleNumbers: number[] 
  @Output('squareselect') newClickEvent = new EventEmitter<{ x: number, y: number }>()
  numbers = Array.from(Array(9).keys()).map((n) => n + 1)
  
  constructor(public sudoku: SudokuService) { }
}
