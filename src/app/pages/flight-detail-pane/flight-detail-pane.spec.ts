import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailPane } from './flight-detail-pane';

describe('FlightDetailPane', () => {
  let component: FlightDetailPane;
  let fixture: ComponentFixture<FlightDetailPane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDetailPane]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDetailPane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
