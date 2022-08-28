import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import type { GameMode, SudokuValue } from 'src/types';

@Component({
  selector: 'square',
  template: `
    <div class="board__square" [class.L]="column % 3 === 0" [class.R]="column % 3 === 2" [class.canEdit]="mode === 'Play' && !locked" [class.invalid]="invalid">{{ value }}</div>
  `,
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnChanges {
  @Input() mode: GameMode
  @Input() value: SudokuValue
  @Input() column: number
  @Input() invalid: boolean
  @Input() locked: Boolean

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      const change = changes[propName]
      const current = JSON.stringify(change.currentValue)
    }
  }
}