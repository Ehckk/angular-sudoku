import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysquareComponent } from './playsquare.component';

describe('PlaysquareComponent', () => {
  let component: PlaysquareComponent;
  let fixture: ComponentFixture<PlaysquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaysquareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaysquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
