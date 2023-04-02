import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent {
  @Output() addDroneEvent: EventEmitter<void>;

  public constructor() {
    this.addDroneEvent = new EventEmitter<void>();
  }

  public onAddDrone(e: MouseEvent): void {
    this.addDroneEvent.emit();
  } 

  public onBlockZone(e: MouseEvent): void {
    console.log("go to block zone");
  }
}
