import { Component, EventEmitter, Output } from '@angular/core';
import {NgForm} from "@angular/forms";
import {CircleMarker, LayerGroup, LeafletMouseEvent} from "leaflet";
import * as L from 'leaflet';
import {MapMouseEvent} from "../../model/MapMouseEvent";
import {MapService} from "../services/map.service";
import {Router} from "@angular/router";
import {Drone} from "../../model/Drone";
import {Point} from "../../model/Point";
import {Path} from "../../model/Path";
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-add-drone',
  templateUrl: './add-drone.component.html',
  styleUrls: ['./add-drone.component.sass']
})
export class AddDroneComponent {
  private start: CircleMarker | undefined;
  private arrival: CircleMarker | undefined;
  private mapState: "SettingStart" | "SettingArrival" = "SettingStart";
  public pathDefinedByServer: "input" | "loading" | "confirm" = "input";
  private readonly layer: LayerGroup;
  public drone: Drone | undefined;

  @Output() callback: EventEmitter<(e: MapMouseEvent) => void>;

  public constructor(public mapService: MapService, protected router: Router, private webSocket: WebSocketService ) {
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
        .setLatLng(event.latlng)
        .addTo(this.layer);
      this.mapState = "SettingStart";
    }
  }

  public async onSubmit(f: NgForm) {
    if (!this.start || !this.arrival) {
      alert("Please click twice to add your start and end point")
      throw new Error("Please click twice to add your start and end point");
    }

    if (!f.value.drName) {
      alert("Please enter your drone name");
      throw new Error("Please enter your drone name");
    }
    if (!f.value.owner) {
      alert("Please enter your drone owner");
      throw new Error("Please enter your drone owner");
    }
    if (!f.value.priority) {
      alert("Please enter your drone priority");
      throw new Error("Please enter your drone priority");
    }

    let obj = {
      name: f.value.drName,
      owner: f.value.owner,
      priority: f.value.priority,
      start: this.start.getLatLng(),
      arrival: this.arrival?.getLatLng()
    };
    const drone = new Drone(
      obj.name,
      obj.owner,
      obj.priority,
      new Path([]),
      new Point(obj.start),
      new Point(obj.arrival)
    );
    console.log(JSON.stringify(drone));
    let msg = await this.sendDrone(drone);
    this.displayPath(msg.data.path);
  }

  displayPath(path: Path) {
    L.polyline(path.toLatLang()).addTo(this.layer);
  }

  public confirmPath() {
    // this.webSocket.confirmNewDronePath()...
  }

  public sendDrone(drone: Drone) {
    this.drone = drone;
    this.pathDefinedByServer = "loading";
    return this.webSocket.sendNewDrone(drone)
      .then((data) => {
        console.info("received: ", data);
        return data;
      })
      .catch((e) => {
        alert("cant connect to server. Error: " + e);
        throw e;
      })
      .finally(() => {
        this.pathDefinedByServer = "confirm";
      });
  }
}
