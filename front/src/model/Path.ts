import {Point} from "./Point";
import {point} from "leaflet";

export class Path {
    constructor(private points : Point[]) {
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
