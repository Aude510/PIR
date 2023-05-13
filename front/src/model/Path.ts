import {IPoint, Point} from "./Point";
import {LatLng, point} from "leaflet";

export type IPath = {
  points: IPoint[];
}
export class Path {
    constructor(public points : Point[]) {  }

    toLatLang(): LatLng[] {
        return this.points.map((p) => p.toLatLng());
    }

  static fromServer(path: IPoint[]) {
    return new Path(
      path.map((p) => {
        console.log("parsed " + p);
        return Point.fromTuple(p.x, p.y);
      })
    )
  }
}
