import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPathNotificationComponent } from './confirm-path-notification.component';

describe('ConfirmPathNotificationComponent', () => {
  let component: ConfirmPathNotificationComponent;
  let fixture: ComponentFixture<ConfirmPathNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPathNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPathNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
