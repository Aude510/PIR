import { Component } from '@angular/core';
import {MapMouseEvent} from "../../model/MapMouseEvent";
import { LatLng } from 'leaflet';
import * as L from "leaflet";



@Component({
  selector: 'app-block-zone',
  templateUrl: './block-zone.component.html',
  styleUrls: ['./block-zone.component.sass']
})
export class BlockZoneComponent {

  private listePoints: Array<LatLng> = []; // ne pas oublier d'init 

  addPoint(event: MapMouseEvent){
    /* add marqueur sur la map de l'event à la position du point */ 
    var marker: L.Marker = new L.Marker(event.event.latlng); 
    event.map.addLayer(marker);
    // add point à la liste 
    this.listePoints.push(event.event.latlng); 
    // tracer polygone si plus de 3 points 
    if (this.listePoints.length>3){
    }

  }


}
