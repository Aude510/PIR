import { Component } from '@angular/core';
import { MapMouseEvent } from 'src/model/MapMouseEvent';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {
  public eventCallback: (e: MapMouseEvent) => void;

  public constructor() {
    this.eventCallback = (e: MapMouseEvent) => {};
  }

  public onMapClickCallback(callback: (e: MapMouseEvent) => void): void {
    this.eventCallback = callback;
  }

  onMapClick(e: MapMouseEvent): void {
    this.eventCallback(e);
  }
}
