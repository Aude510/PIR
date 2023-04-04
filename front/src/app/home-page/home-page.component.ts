import { Component, EventEmitter, Output } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent {
  @Output() addDroneEvent: EventEmitter<void>;
  @Output() blockZoneEvent: EventEmitter<void>;


  public constructor(private router: Router) {
    this.addDroneEvent = new EventEmitter<void>();
    this.blockZoneEvent = new EventEmitter<void>();

  }

  public onAddDrone(e: MouseEvent): void {
    this.router.navigateByUrl("/add-drone");
  }

  public onBlockZone(e: MouseEvent): void {
    this.blockZoneEvent.emit();
    this.router.navigateByUrl("/block-zone");
    console.log("go to block zone");
  }
}
