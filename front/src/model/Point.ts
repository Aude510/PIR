import { LatLng } from "leaflet";

export type IPoint = {
  x: number;
  y: number;
}
export class Point {
  x: number
  y: number

  constructor(latlng: LatLng) {
    this.x=latlng.lat;
    this.y=latlng.lng;
  }



  public static fromTuple(x: number, y: number): Point {
    return new Point(new LatLng(x, y));
  }

  public toLatLng(): LatLng {
    return new LatLng(this.x, this.y);
  }

  public toArray(): number[] {
    return [this.x, this.y];
  }
}
