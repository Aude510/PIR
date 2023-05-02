import { Injectable } from '@angular/core';
import { LatLng, LayerGroup, LeafletMouseEvent, Polygon } from 'leaflet';
import {Subject} from "rxjs";
import { MapService } from './map.service';
import { AreaMouseEvent } from 'src/model/AreaMouseEvent';

const MAX_POINTS: number = 100;
const DIST: number = 10; 

@Injectable({
  providedIn: 'root'
})
export class MapToDiscretCoordService {
  private points: Array<Array<Polygon>>;
  private sub: Subject<AreaMouseEvent>;
  private layer: LayerGroup;
  private mapService: MapService;
  private origin: LatLng;
  private deltaX: number;
  private deltaY: number;

  constructor(mapService: MapService) { 
    this.layer = new LayerGroup();
    this.origin = new LatLng(0, 0);
    this.sub = new Subject();
    this.points = [];
    this.deltaX = 0;
    this.deltaY = 0;
    this.mapService = mapService;
  }
  
  public setAreaClickCallback(callback: ((e: AreaMouseEvent) => void)) {
    this.sub = new Subject();
    this.sub.subscribe(callback);
  }

  public initArea(lat: number, lng: number): void {
    this.mapService.addToMap(this.layer);    
    
    this.origin = new LatLng(lat, lng);
    let latRad = lat * Math.PI / 180;
    let k: number = DIST / (6371 * 1000);
    let a: number = Math.cos(k);
    let b: number = Math.tan(latRad) * Math.tan(latRad);
    let c: number = Math.cos(latRad) * Math.cos(latRad);
    
    this.deltaX = Math.acos(a / c - b) * 180 / Math.PI;
    this.deltaY = k * 180 / Math.PI; 
    
    for (let y: number = 0; y < MAX_POINTS; y++) {
      this.points[y] = [];
      for (let x: number = 0; x < MAX_POINTS; x++) {        
        let p1: LatLng = new LatLng(lat + y * this.deltaY, lng + x * this.deltaX);
        let p2: LatLng = new LatLng(p1.lat, p1.lng + this.deltaX);
        let p3: LatLng = new LatLng(p1.lat + this.deltaY, p1.lng + this.deltaX);
        let p4: LatLng = new LatLng(p1.lat + this.deltaY, p1.lng);
        let point: Polygon = new Polygon([p1, p2, p3, p4], {color: "#00000000", fillColor: "#f03", fillOpacity: 0.5})
        point.addTo(this.layer);
        this.points[y][x] = point;
      }
    }
  }

  public onMapClick(e: LeafletMouseEvent): void {
    let pos: LatLng = e.latlng;
    let x: number = Math.floor((pos.lng - this.origin.lng) / this.deltaX);
    let y: number = Math.floor((pos.lat - this.origin.lat) / this.deltaY);
  
    if (x >= 0 && x < MAX_POINTS && y >= 0 && y < MAX_POINTS ) {
      this.points[y][x].setStyle({fillColor: '#00ff00'});
      this.sub.next({
        x: x, 
        y: y, 
        lat: this.origin.lat + this.deltaY * ( y + 0.5 ),
        lng: this.origin.lng + this.deltaX * ( x + 0.5 )
      }); 
    }
  }
}
