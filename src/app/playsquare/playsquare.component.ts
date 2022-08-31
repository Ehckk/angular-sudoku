import { Component, Input, OnInit } from '@angular/core';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'playsquare',
  template: `<div class="playboard__square" [class.L]="x > 0 && x % 3 === 0" [class.R]="x < 8 && x % 3 === 2">{{ value }}
    <!-- TODO filled or unfilled class binding to disable or enable a css grid -->
    <ng-container *ngFor="let num of numbers">
      <!-- <div class="playboard__subsquare" [class.hidden]="toggleCandidate()">{{ num }}</div> -->
      <!-- TODO extract to it's own component -->
    </ng-container>
  </div>`,  
  styleUrls: ['./playsquare.component.css']
})
export class PlaysquareComponent implements OnInit {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue
  @Input() invalid: boolean
  @Input() locked: boolean
  @Input() possibleNumbers: number[]
  numbers: number[] = Array.from(Array(9).keys()).map((n) => n + 1)
  candidates: number[] = Array.from(Array(9).keys()).map((n) => n + 1)
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleCandidate(num: number) {
    if (this.candidates.some((n) => n === num)) {
      // Extract to it's own component

      
    }
  }
}
