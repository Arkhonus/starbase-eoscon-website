import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotDetailsComponent } from './lot-details.component';

describe('LotDetailsComponent', () => {
  let component: LotDetailsComponent;
  let fixture: ComponentFixture<LotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
