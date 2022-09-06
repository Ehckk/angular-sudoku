import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  template: `<p class="header">{{textContent}}</p>`,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() textContent: string

  constructor() { }
// TODO: why
  ngOnInit(): void {
  }

}
