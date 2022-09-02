import { Component, Input, OnInit } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'playsquare',
  templateUrl: './playsquare.component.html',
  styleUrls: ['./playsquare.component.css']
})
  // TODO
  // - playable sudoku game logic
  // - playsquares can be highlighted by clicking on them or arrow keys 
  // - typing a number puts it in the square, backspace clears it
  // - candidate mode 
export class PlaysquareComponent implements OnInit {
  @Input() x: number
  @Input() y: number
  @Input() invalid: boolean
  @Input() locked: boolean
  numbers: number[] = Array.from(Array(9).keys()).map((n) => n + 1)
  value: SudokuValue
  
  constructor(public sudoku: SudokuService) { }

  ngOnInit() {
    
  }

  getPossibleNumbers() {
    return this.numbers.filter((num) => this.sudoku.validMove(num, this.x, this.y))
  }

  toggleCandidate(num: number) {
    return !this.getPossibleNumbers().some((n) => n === num)
  } 
}
