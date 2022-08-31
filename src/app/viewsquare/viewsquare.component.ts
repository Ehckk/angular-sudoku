import { Component, Input } from '@angular/core';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'viewsquare',
  template: `<div class="viewboard__square" [class.L]="x > 0 && x % 3 === 0" [class.R]="x < 8 && x % 3 === 2">{{ value }}</div>`,
  styleUrls: ['./viewsquare.component.css']
})
export class ViewsquareComponent {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue

  constructor() { }
}
