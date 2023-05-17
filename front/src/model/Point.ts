import { LatLng } from "leaflet";
import {IEquals} from "./IEquals";

export type IPoint = {
  x: number;
  y: number;
}
export class Point implements IEquals<Point> {
  x: number
  y: number

  constructor(latlng: LatLng) {
    this.x=latlng.lat;
    this.y=latlng.lng;
  }

  equals(other: Point): boolean {
       return this.x === other.x && this.y === other.y;
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
