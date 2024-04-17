import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorCardComponent } from './exhibitor-card.component';

describe('ExhibitorCardComponent', () => {
  let component: ExhibitorCardComponent;
  let fixture: ComponentFixture<ExhibitorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitorCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
