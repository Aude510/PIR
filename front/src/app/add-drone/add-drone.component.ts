import { Component, EventEmitter, Output } from '@angular/core';
import {NgForm} from "@angular/forms";
import {CircleMarker, LeafletMouseEvent} from "leaflet";
import * as L from 'leaflet';
import {MapMouseEvent} from "../../model/MapMouseEvent";
import {MapService} from "../services/map.service";

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

  public constructor(private mapService: MapService) {
    this.callback = new EventEmitter<(e: MapMouseEvent) => void>();
    this.mapService.onMapClicked().subscribe((e) => {
      this.leafletClick(e);
    })
  }
  public leafletClick(event: LeafletMouseEvent) {
    let point = event.latlng;
    if( !this.mapService.map ) {
      alert("The map is not initialised, please refresh and try again");
      return;
    }
    if (this.mapState === "SettingStart") {
      this.start?.remove();
      this.start = L.circleMarker(point).setStyle({color: 'green'}).setLatLng(event.latlng).addTo(this.mapService.map);
      this.mapState = "SettingArrival";
    } else {
      this.arrival?.remove()
      this.arrival = L.circleMarker(point).setStyle({color:'blue'}).setLatLng(event.latlng).addTo(this.mapService.map);
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
