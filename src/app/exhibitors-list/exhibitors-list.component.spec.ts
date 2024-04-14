import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorsListComponent } from './exhibitors-list.component';

describe('ExhibitorsListComponent', () => {
  let component: ExhibitorsListComponent;
  let fixture: ComponentFixture<ExhibitorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitorsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
