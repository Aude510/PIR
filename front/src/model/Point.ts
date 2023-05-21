import { LatLng } from "leaflet";
import {IEquals} from "./IEquals";
import {Square} from "./Square";

export type IPoint = {
  x: number;
  y: number;
}
export class Point implements IEquals<Point> {
  public x: number
  public y: number

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

  public pointInRect(rect: Square): boolean {
    return Point.pointInRect(this, rect);
  }
  public static pointInRect(point: Point, rect: Square): boolean {

    const minX = rect.points[0].x < rect.points[2].x ? rect.points[0].x : rect.points[2].x;
    const minY = rect.points[0].y < rect.points[2].y ? rect.points[0].y : rect.points[2].y;
    const maxX = rect.points[0].x > rect.points[2].x ? rect.points[0].x : rect.points[2].x;
    const maxY = rect.points[0].y > rect.points[2].y ? rect.points[0].y : rect.points[2].y;
    // @ts-ignore
    const f = (x1, y1, x2, y2, x, y) => (
      (x > x1 && x < x2) && (y > y1 && y < y2)
    );
    return f(minX, minY, maxX, maxY, point.x, point.y);
  }
}
