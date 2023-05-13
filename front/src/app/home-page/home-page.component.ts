import { Component, EventEmitter, Output } from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../services/map.service";
import {WebSocketService} from "../services/web-socket.service";
import {LayerGroup} from "leaflet";
import * as L from "leaflet";
import {MapToDiscretCoordService} from "../services/map-to-discret-coord.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent {
  @Output() addDroneEvent: EventEmitter<void>;
  @Output() blockZoneEvent: EventEmitter<void>;

  private layer: LayerGroup = new L.LayerGroup();

  public constructor(private router: Router,
                     private mapService: MapService,
                     private webSocket: WebSocketService,
                     private coords: MapToDiscretCoordService) {
    this.addDroneEvent = new EventEmitter<void>();
    this.blockZoneEvent = new EventEmitter<void>();
    this.mapService.onMapClickedTakeSubscription();
    this.mapService.addToMap(this.layer);
    this.webSocket.subToMapUpdate().subscribe((status) => {
      console.log("mmmmmmmmmmmmmmmmmmmmmm")
      console.log(status.drones)
      this.layer.remove();
      this.layer = new L.LayerGroup();
      this.mapService.addToMap(this.layer);
      status.drones.forEach((drone) => {
        console.log("Drone: " + drone.name);
        this.coords.addDroneToMap(drone, this.layer);
      })
    })
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
