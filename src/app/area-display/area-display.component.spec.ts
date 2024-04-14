import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDisplayComponent } from './area-display.component';

describe('GateDisplayComponent', () => {
  let component: AreaDisplayComponent;
  let fixture: ComponentFixture<AreaDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
