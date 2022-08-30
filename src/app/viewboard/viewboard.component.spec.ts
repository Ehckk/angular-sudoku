import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewboardComponent } from './viewboard.component';

describe('ViewboardComponent', () => {
  let component: ViewboardComponent;
  let fixture: ComponentFixture<ViewboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
