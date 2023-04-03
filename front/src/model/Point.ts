import { LatLng } from "leaflet";

export class Point { 
  x: number
  y: number

  constructor(latlng: LatLng) {
    this.x=latlng.lat;
    this.y=latlng.lng;

  }
}
