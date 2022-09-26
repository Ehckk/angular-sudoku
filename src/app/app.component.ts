import { Component, Directive } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: String = 'sudoku';
  lightTheme: boolean = document.body.classList.contains('lightTheme')
  
  constructor() {}

  toggleLightMode() {
    document.body.classList.toggle('lightTheme')
    this.lightTheme = document.body.classList.contains('lightTheme')
  }
}
