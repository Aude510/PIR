import {Point} from "./Point";
import {LatLng, point} from "leaflet";

export class Path {
    // public points: Point[] = [];

    constructor(public points: Point[]) {

    }

    toLatLang(): LatLng[] {
        return this.points.map((p) => p.toLatLng());
    }

}
