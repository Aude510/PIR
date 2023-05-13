import {Point} from "./Point";
import {LatLng, point} from "leaflet";

export class Path {
    constructor(private points : Point[]) {
    }

    toLatLang(): LatLng[] {
        return this.points.map((p) => p.toLatLng());
    }

}
