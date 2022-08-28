import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { ControlNames, GameMode } from 'src/types';

@Component({
  selector: 'controls',
  template: `
    <ng-container [ngSwitch]="mode">
      <div class="controls__buttonWrapper" *ngSwitchCase="'Generate'">
        <button class="controls__button" [class.disabled]="isEmpty || isGenerating || isSaving" (click)="controlState.emit('Clear')">{{ 'Clear' }}</button>
        <button class="controls__button" [class.disabled]="isGenerating || isSaving" (click)="controlState.emit('Generate')">{{ isGenerating ? 'Generating...' : 'Generate' }}</button>
        <button class="controls__button" [class.disabled]="!isWin || isSaving" (click)="controlState.emit('Save')">{{ isSaving ? 'Saving...' : 'Save' }}</button>
      </div>
      <div class="controls__buttonWrapper" *ngSwitchCase="'Play'">
        <button class="controls__button" [class.disabled]="isSolving || isFetching || isWin" (click)="controlState.emit('Reset')">{{ 'Reset' }}</button>
        <button class="controls__button" [class.disabled]="isSolving || isFetching" (click)="controlState.emit('New Game')">{{ 'New Game' }}</button>
        <button class="controls__button" [class.disabled]="isSolving || isWin || isFetching" (click)="controlState.emit('Give Up')">{{ isSolving ? 'Solving...' : 'Give Up' }}</button>
      </div>
    </ng-container>
  `,
  styleUrls: ['./controls.component.css']
})

export class ControlsComponent implements OnChanges {
  @Input() mode: GameMode
  @Input() isWin: boolean
  @Input() isEmpty: boolean
	@Input() isGenerating: boolean
	@Input() isSaving: boolean
	@Input() isReset: boolean
	@Input() isFetching: boolean
	@Input() isSolving: boolean
	@Output() controlState = new EventEmitter<ControlNames>()
  controls: ControlNames

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.mode);
    
  }
}