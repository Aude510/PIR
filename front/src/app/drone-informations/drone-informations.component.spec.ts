import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneInformationsComponent } from './drone-informations.component';

describe('DroneInformationsComponent', () => {
  let component: DroneInformationsComponent;
  let fixture: ComponentFixture<DroneInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroneInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroneInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
