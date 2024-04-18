import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentLotDisplayComponent } from './current-lot-display.component';

describe('CurrentLotDisplayComponent', () => {
  let component: CurrentLotDisplayComponent;
  let fixture: ComponentFixture<CurrentLotDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentLotDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentLotDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
