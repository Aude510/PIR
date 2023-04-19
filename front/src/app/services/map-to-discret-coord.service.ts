import { Injectable } from '@angular/core';
import { Circle, LatLng, LayerGroup, Marker, Point } from 'leaflet';
import { MapService } from './map.service';

const MAX_POINTS: number = 50;
const DIST: number = 10; 

@Injectable({
  providedIn: 'root'
})
export class MapToDiscretCoordService {

  private points: Array<Array<LatLng>>;
  private layer: LayerGroup;
  private mapService: MapService;

  // récupérer carte 


  // placer l'origine en 43.652290 ; 1.325378 (méthode)


  // discrétiser la zone + afficher tous les points 

  // tableau en 2D pour garder les points (500*500)


  // faire une méthode pour traduire un latlng dans nos coordonnées 

  constructor(mapService: MapService) { 
    this.points = [];
    this.layer = new LayerGroup();
    this.mapService = mapService;
  }
  
  public computeArea(lat: number, lng: number): void {
    this.mapService.addToMap(this.layer);

    // let k: number = DIST / 6371 * 1000;
    // let a: number = Math.cos(k);
    // let b: number = Math.sin(lat) * Math.sin(lat);
    // let c: number = Math.cos(lat) * Math.cos(lat);

    // let deltaX: number = Math.acos((a - b) / c);
    // let deltaY: number = DIST / k; 

    // console.log(deltaX, deltaY, (a - b) / c);

    for (let y: number = 0; y < MAX_POINTS; y++) {
      this.points[y] = [];
      for (let x: number = 0; x < MAX_POINTS; x++) {
        this.points[y][x] = new LatLng(
          lat + y * 0.0000730,
          lng + x * 0.0001329
        );

        let point: Circle = new Circle(this.points[y][x], { 
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 2.5
        })
        point.addTo(this.layer);
      }
    }
  }
}
