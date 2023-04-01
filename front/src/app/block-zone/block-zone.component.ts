import { Component } from '@angular/core';
import {MapMouseEvent} from "../../model/MapMouseEvent";
import { LatLng } from 'leaflet';


@Component({
  selector: 'app-block-zone',
  templateUrl: './block-zone.component.html',
  styleUrls: ['./block-zone.component.sass']
})
export class BlockZoneComponent {

  private listePoints: Array<LatLng> = []; // ne pas oublier d'init 


  addPoint(event: MapMouseEvent) {
    /* add marqueur sur la map de l'event à la position du point */ 
    // tracer polygone si plus de 3 points 
  }
}
