import {IPoint, Point} from "./Point";
import {LatLng} from "leaflet";
import {IEquals} from "./IEquals";
import _ from "lodash";

export type IPath = {
  points: IPoint[];
}
export class Path implements IEquals<Path> {
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
  getPath(){
    return this.points;
  }

  equals(other: Path): boolean {
    if(other.points.length != this.points.length) {
      return false;
    }
    return this.points.reduce( (prev, current, index) => {
      return prev && current.equals(other.points[index])
    }, true);
  }

  contains(other: Path) {
      if (this.points.length < other.points.length) {
        return false;
      }
      return _.intersectionWith(this.points, other.points, _.isEqual).length == other.points.length;
  }


}
