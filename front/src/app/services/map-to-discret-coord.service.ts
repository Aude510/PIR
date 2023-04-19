import { Injectable } from '@angular/core';
import { LatLng, LayerGroup, Marker, Point } from 'leaflet';
import { MapService } from './map.service';

const MAX_POINTS: number = 50; 

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
    // console.log(lat, lng);
    for (let y: number = 0; y < MAX_POINTS; y++) {
      this.points[y] = [];
      for (let x: number = 0; x < MAX_POINTS; x++) {
        this.points[y][x] = new LatLng(
          lat + y * 0.01,
          lng + x * 0.01
        );

        let point: Marker = new Marker(this.points[y][x])
        point.addTo(this.layer);
      }
    }
  }
}
