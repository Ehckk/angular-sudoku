import { Component, Input } from '@angular/core';
import { SudokuValue } from 'src/types';

@Component({
  selector: 'viewsquare',
  template: `<div class="viewboard__square" [class.borderL]="x === 3 || x == 6">{{ value }}</div>`,
  styleUrls: ['./viewsquare.component.css']
})
export class ViewsquareComponent {
  @Input() x: number
  @Input() y: number
  @Input() value: SudokuValue

  constructor() { }
}
