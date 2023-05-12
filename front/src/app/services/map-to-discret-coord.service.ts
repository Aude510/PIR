import { Injectable } from '@angular/core';
import { LatLng, Polygon, latLng } from 'leaflet';
import { Point } from 'src/model/Point';
import { MapService } from './map.service';

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
    this.origin = new LatLng(lat - this.deltaY * (MAX_POINTS + 1) / 2, lng - this.deltaX * (MAX_POINTS + 1) / 2);

    let p0 = new LatLng(this.origin.lat, this.origin.lng);
    let p1 = new LatLng(this.origin.lat + this.deltaY * (MAX_POINTS + 1), this.origin.lng);
    let p2 = new LatLng(this.origin.lat + this.deltaY * (MAX_POINTS + 1), this.origin.lng + this.deltaX * (MAX_POINTS + 1));
    let p3 = new LatLng(this.origin.lat, this.origin.lng + this.deltaX * (MAX_POINTS + 1));
    let polygon = new Polygon([p0, p1, p2, p3], {color: "#0000ffff", fillColor: "#00000000", fillOpacity: 0.2});

    this.mapService.insertInMap(polygon);
  }

  public onZone(pos: LatLng): boolean{
    let x: number = Math.floor((pos.lng - this.origin.lng) / this.deltaX);
    let y: number = Math.floor((pos.lat - this.origin.lat) / this.deltaY);
    return (x >= 0 && x < MAX_POINTS && y >= 0 && y < MAX_POINTS ); 
  }

  public convert(point: LatLng): Point{
    let x: number = Math.floor((point.lng - this.origin.lng) / this.deltaX);
    let y: number = Math.floor((point.lat - this.origin.lat) / this.deltaY);
    return new Point(latLng(x, y)); 
  }
}
