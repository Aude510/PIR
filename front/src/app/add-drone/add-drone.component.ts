import { Component, EventEmitter, Output } from '@angular/core';
import {NgForm} from "@angular/forms";
import {CircleMarker, Layer, LayerGroup, LeafletMouseEvent} from "leaflet";
import * as L from 'leaflet';
import {MapMouseEvent} from "../../model/MapMouseEvent";
import {MapService} from "../services/map.service";
import {Router} from "@angular/router";
import {WebSocketService} from "../web-socket.service";
import {Drone} from "../../model/Drone";
import {Point} from "../../model/Point";

@Component({
  selector: 'app-add-drone',
  templateUrl: './add-drone.component.html',
  styleUrls: ['./add-drone.component.sass']
})
export class AddDroneComponent {
  private start: CircleMarker | undefined;
  private arrival: CircleMarker | undefined;
  private mapState: "SettingStart" | "SettingArrival" = "SettingStart";
  public isLoading = false;
  private layer: LayerGroup;

  @Output() callback: EventEmitter<(e: MapMouseEvent) => void>;

  public constructor(private mapService: MapService, private router: Router, private webSocket: WebSocketService ) {
    this.callback = new EventEmitter<(e: MapMouseEvent) => void>();
    this.mapService.onMapClickedTakeSubscription().subscribe((e) => {
      this.leafletClick(e);
    })
    this.layer = new L.LayerGroup();
    this.mapService.addToMap(this.layer);
  }
  public leafletClick(event: LeafletMouseEvent) {
    let point = event.latlng;
    if (this.mapState === "SettingStart") {
      this.start?.remove();
      this.start = L.circleMarker(point)
        .setStyle({color: 'green'})
        .setLatLng(event.latlng)
        .addTo(this.layer);
      this.mapState = "SettingArrival";
    } else {
      this.arrival?.remove()
      this.arrival = L
        .circleMarker(point)
        .setStyle({color:'blue'})
        .setLatLng(event.latlng).
        addTo(this.layer);
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
      owner: f.value.owner,
      priority: f.value.priority,
      start: this.start.getLatLng(),
      arrival: this.arrival?.getLatLng()
    };
    const drone = new Drone(obj.name,
      obj.owner,
      obj.priority,
      {points: []},
      new Point(obj.start),
      new Point(obj.arrival)
    );
    console.log(JSON.stringify(drone));
    this.isLoading = true;
    this.webSocket.sendNewDrone(drone)
      .then((data) => {
        console.log("received: ", data);
      })
      .catch((e) => {
        alert("cant connect to server. Error: " + e);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
