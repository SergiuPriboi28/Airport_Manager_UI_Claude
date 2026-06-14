import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportCreateForm } from './airport-create-form';

describe('AirportCreateForm', () => {
  let component: AirportCreateForm;
  let fixture: ComponentFixture<AirportCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirportCreateForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirportCreateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
