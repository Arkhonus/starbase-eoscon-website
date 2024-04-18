import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorListSeparatorComponent } from './exhibitor-list-separator.component';

describe('ExhibitorListSeparatorComponent', () => {
  let component: ExhibitorListSeparatorComponent;
  let fixture: ComponentFixture<ExhibitorListSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExhibitorListSeparatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExhibitorListSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
