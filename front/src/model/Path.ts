import {Point} from "./Point";
import {point} from "leaflet";

export class Path {
    points: Point[]
    constructor(pointList : Point[]) {
      this.points = pointList;
    }

    addPoint(point: Point){
      this.points.push(point);
    }
    clearPath(){
      while(this.points.length > 0){
        this.points.pop();
      }
    }
  }
