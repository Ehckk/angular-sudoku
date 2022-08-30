import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsquareComponent } from './viewsquare.component';

describe('ViewsquareComponent', () => {
  let component: ViewsquareComponent;
  let fixture: ComponentFixture<ViewsquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewsquareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
