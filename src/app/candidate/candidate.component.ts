import { Component, Input } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';

@Component({
  selector: 'candidate',
  template: `
    <div class="candidate__subsquare" 
      [class.hidden]="hidden" 
      [class.highlighted]="highlighted"
      [class.selected]="selected" 
      [class.auto]="sudoku.auto">{{ candidate }}
    </div>
    `,
    // (click)="handleClick()"
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent {
  @Input() candidate: number
  @Input() hidden: boolean
  @Input() highlighted: boolean
  selected: boolean

  constructor(public sudoku: SudokuService) { }

  handleClick() {
    this.selected = !this.selected
  }
}
