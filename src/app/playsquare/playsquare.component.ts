import { Component, Input, OnInit } from '@angular/core';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'playsquare',
  template: `<div class="playboard__square" [class.L]="x > 0 && x % 3 === 0" [class.R]="x < 8 && x % 3 === 2">{{ value }}

  </div>
  
  `,
  styleUrls: ['./playsquare.component.css']
})
export class PlaysquareComponent implements OnInit {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue
  @Input() invalid: boolean
  @Input() locked: boolean
  @Input() possibleNumbers: number[]
  
  constructor() { }

  ngOnInit(): void {
  }

}
