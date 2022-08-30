import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { SudokuService } from 'src/services/sudoku.service';

@Component({
  selector: 'playboard',
  templateUrl: './playboard.component.html',
  styleUrls: ['./playboard.component.css']
})
export class PlayboardComponent implements OnInit {
  headerText: string
  isSolving: boolean
  isFetching: boolean
  isWin: boolean

  constructor (public sudoku: SudokuService, private db: AngularFireDatabase, public router: Router) { }
  
  ngOnInit(): void {
  }

}
