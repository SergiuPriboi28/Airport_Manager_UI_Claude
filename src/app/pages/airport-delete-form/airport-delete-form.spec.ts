import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportDeleteForm } from './airport-delete-form';

describe('AirportDeleteForm', () => {
  let component: AirportDeleteForm;
  let fixture: ComponentFixture<AirportDeleteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportDeleteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportDeleteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
