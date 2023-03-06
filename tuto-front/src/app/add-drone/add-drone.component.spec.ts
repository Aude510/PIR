import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDroneComponent } from './add-drone.component';

describe('AddDroneComponent', () => {
  let component: AddDroneComponent;
  let fixture: ComponentFixture<AddDroneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDroneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
