import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportViewForm } from './airport-view-form';

describe('AirportViewForm', () => {
  let component: AirportViewForm;
  let fixture: ComponentFixture<AirportViewForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportViewForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportViewForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
