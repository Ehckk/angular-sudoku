import { Component, Input } from '@angular/core';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'viewsquare',
  // [class.borderL]="x === 3 || x == 6"
  template: `<div class="viewboard__square" [class.mx]="x > 0 && x % 3 === 0" [class.my]="y > 0 && y % 3 === 0">{{ value }}</div>`,
  styleUrls: ['./viewsquare.component.css']
})
export class ViewsquareComponent {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue

  constructor() { }
}
