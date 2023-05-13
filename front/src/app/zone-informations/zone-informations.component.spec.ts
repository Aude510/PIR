import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneInformationsComponent } from './zone-informations.component';

describe('ZoneInformationsComponent', () => {
  let component: ZoneInformationsComponent;
  let fixture: ComponentFixture<ZoneInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
