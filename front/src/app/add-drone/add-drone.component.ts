import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgForm} from "@angular/forms";
import {CircleMarker, LatLng, Marker} from "leaflet";
import * as L from 'leaflet';
import {MapMouseEvent} from "../../model/MapMouseEvent";

@Component({
  selector: 'app-add-drone',
  templateUrl: './add-drone.component.html',
  styleUrls: ['./add-drone.component.sass']
})
export class AddDroneComponent {
  private start: CircleMarker | undefined;
  private arrival: CircleMarker | undefined;
  private mapState: "SettingStart" | "SettingArrival" = "SettingStart";

  @Output() callback: EventEmitter<(e: MapMouseEvent) => void>;

  public constructor() {
    this.callback = new EventEmitter<(e: MapMouseEvent) => void>();
  }

  public ngOnInit(): void {
    this.callback.emit((e: MapMouseEvent): void => { this.leafletClick(e) });
  }

  public leafletClick(event: MapMouseEvent): void {
    let point = event.event.latlng;

    if (this.mapState === "SettingStart") {
      this.start?.remove();
      this.start = L.circleMarker(point).setStyle({color: 'green'}).setLatLng(event.event.latlng).addTo(event.map);
      this.mapState = "SettingArrival";
    } else {
      this.arrival?.remove()
      this.arrival = L.circleMarker(point).setStyle({color:'blue'}).setLatLng(event.event.latlng).addTo(event.map);
      this.mapState = "SettingStart";
    }
  }

  public onSubmit(f: NgForm): void {
    if (!this.start || !this.arrival) {
      throw new Error("Please click twice to add your start and end point");
    }

    if (!f.value.drName) {
      throw new Error("Please enter your drone name");
    }
    
    let obj = {
      name: f.value.drName,
      start: this.start.getLatLng(),
      arrival: this.arrival?.getLatLng()
    };

    console.log(JSON.stringify(obj));
  }
}
