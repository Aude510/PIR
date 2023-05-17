import { Injectable } from '@angular/core';
import {LatLng, Polygon, latLng, LayerGroup} from 'leaflet';
import {IPoint, Point} from 'src/model/Point';
import { MapService } from './map.service';
import {Drone} from "../../model/Drone";
import * as L from "leaflet";
import {Zone} from "../../model/Zone";

const MAX_POINTS: number = 500;
const DIST: number = 10;

@Injectable({
  providedIn: 'root'
})
export class MapToDiscretCoordService {
  private mapService: MapService;
  private origin: LatLng;
  private deltaX: number;
  private deltaY: number;

  constructor(mapService: MapService) {
    this.origin = new LatLng(0, 0);
    this.deltaX = 0;
    this.deltaY = 0;
    this.mapService = mapService;
  }

  public initArea(lat: number, lng: number): void {
    let latRad = lat * Math.PI / 180;
    let k: number = DIST / (6371 * 1000);
    let a: number = Math.cos(k);
    let b: number = Math.tan(latRad) * Math.tan(latRad);
    let c: number = Math.cos(latRad) * Math.cos(latRad);

    this.deltaX = Math.acos(a / c - b) * 180 / Math.PI;
    this.deltaY = k * 180 / Math.PI;
    this.origin = new LatLng(lat - this.deltaY * MAX_POINTS / 2, lng - this.deltaX * MAX_POINTS / 2);

    let p0 = new LatLng(this.origin.lat, this.origin.lng);
    let p1 = new LatLng(this.origin.lat + this.deltaY * MAX_POINTS, this.origin.lng);
    let p2 = new LatLng(this.origin.lat + this.deltaY * MAX_POINTS, this.origin.lng + this.deltaX * MAX_POINTS);
    let p3 = new LatLng(this.origin.lat, this.origin.lng + this.deltaX * MAX_POINTS);
    let polygon = new Polygon([p0, p1, p2, p3], {color: "#0000ffff", fillColor: "#00000000", fillOpacity: 0.2});

    this.mapService.insertInMap(polygon);
  }

  public onZone(pos: LatLng): boolean{
    let x: number = Math.floor((pos.lng - this.origin.lng) / this.deltaX);
    let y: number = Math.floor((pos.lat - this.origin.lat) / this.deltaY);
    return (x >= 0 && x < MAX_POINTS && y >= 0 && y < MAX_POINTS );
  }

  public latLngToDiscret(point: LatLng): Point{
    let x: number = Math.floor((point.lng - this.origin.lng) / this.deltaX);
    let y: number = Math.floor((point.lat - this.origin.lat) / this.deltaY);
    return new Point(latLng(x, y));
  }

  public discretToLatLng(x: number, y: number): LatLng {
    let lat: number = (this.origin.lat + y * this.deltaY) + this.deltaY / 2;
    let lng: number = (this.origin.lng + x * this.deltaX) + this.deltaX / 2;
    return new LatLng(lat, lng);
  }

  public discretToLatLngFromPoint(p: Point): LatLng {
    return this.discretToLatLng(p.x, p.y);
  }

  public addZoneToMap(zone: IPoint[], layer: LayerGroup) {
    console.log(zone)
    // @ts-ignore
    L.polygon(zone.map((p) => this.discretToLatLngFromPoint(p))).addTo(layer);
  }

  public getNearestLatLng(point: LatLng): LatLng {
    let p: Point = this.latLngToDiscret(point);
    return this.discretToLatLng(p.x, p.y);
  }

  public addDroneToMap(drone: Drone, layer: LayerGroup) {
    L.circleMarker(this.discretToLatLngFromPoint(drone.start),{color: 'green'}).addTo(layer);
    L.circleMarker(this.discretToLatLngFromPoint(drone.destination), {color: 'blue'}).addTo(layer);
    const path = drone.path.points.map((p) => this.discretToLatLngFromPoint(p));
    L.polyline(path).addTo(layer);
    const icon = L.icon({
      iconUrl: './assets/drone.png',

      iconSize:     [38, 95], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    // @ts-ignore
    L.marker(path[0], {icon: icon, title: drone.name}).addTo(layer);
  }


}
