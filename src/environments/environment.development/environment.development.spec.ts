import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentDevelopment } from './environment.development';

describe('EnvironmentDevelopment', () => {
  let component: EnvironmentDevelopment;
  let fixture: ComponentFixture<EnvironmentDevelopment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentDevelopment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentDevelopment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
