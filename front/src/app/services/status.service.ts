import { Injectable } from '@angular/core';
import {Status} from "../../model/Status";
import {WebSocketService} from "./web-socket.service";
import {LatLng} from "leaflet";

/**
 * This service is an abstraction around the Status object,
 * it enables other components to easily interact with the most up-to-date status information possible
 */
@Injectable({
  providedIn: 'root'
})
export class StatusService {

  public status: Status | undefined;
  constructor(private socket: WebSocketService) {
    this.socket.subToMapUpdate().subscribe((d) => {
      this.status = d.data;
    })
  }

  public getDroneByLatLangStart(latLang: LatLng, margin: number) {
    if (!this.status) {
      return [];
    }
    return this.status.drones
      .filter((d) => d.start.toLatLng().equals(latLang, margin));
  }

  public getDroneList(){
    return this.status ? this.status.drones : [];
  }
}
