import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'playsquare',
  templateUrl: './playsquare.component.html',
  styleUrls: ['./playsquare.component.css']
})
  // TODO candidate mode 
export class PlaysquareComponent {
  @Input() x: number
  @Input() y: number
  @Input() invalid: boolean
  @Input() locked: boolean
  @Input() selected: boolean
  @Input() value: SudokuValue
  @Output() squareEvent = new EventEmitter<{ x: number, y: number }>()
  numbers: number[] = Array.from(Array(9).keys()).map((n) => n + 1)
  
  constructor(public sudoku: SudokuService) { }

  handleClick() {
    this.sudoku.highlightX = this.x
    this.sudoku.highlightY = this.y
  }

  getPossibleNumbers() {
    return this.numbers.filter((num) => this.sudoku.validMove(num, this.x, this.y))
  }

  toggleCandidate(num: number) {
    return !this.getPossibleNumbers().some((n) => n === num)
  } 
}
