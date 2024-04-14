import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorDetailsComponent } from './exhibitor-details.component';

describe('ExhibitorDetailsComponent', () => {
  let component: ExhibitorDetailsComponent;
  let fixture: ComponentFixture<ExhibitorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitorDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
