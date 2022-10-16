import { Component, Input } from '@angular/core';
import { SudokuService } from 'src/services/sudoku.service';

@Component({
  selector: 'candidate',
  template: `<div class="subsquare" [class.hidden]="hidden" [class.selected]="selected" (click)="handleClick()">{{ candidate }}</div>`,
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent {
  @Input() candidate: number
  @Input() hidden: boolean
  selected: boolean

  constructor(public sudoku: SudokuService) { }

  handleClick() {
    if (!this.hidden) {
      this.selected = !this.selected
    }
  }
}
