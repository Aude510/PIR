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
    let maxNbPts: number = 5; 
    // let scope {}
    // var scope par fonction (à éviter)
    // attention const = final en java, pas constante 
    /* add marqueur sur la map de l'event à la position du point */ 
    let marker: L.Marker = new L.Marker(event.event.latlng); 
    event.map.addLayer(marker);
    // add point à la liste 
    this.listePoints.push(event.event.latlng); 
    // tracer polygone si plus de 3 points 
    if (this.listePoints.length>2){
      event.map.eachLayer((layer) => {layer.remove();}); // se démerder pour pas flush la map 
      let polygon = L.polygon(this.listePoints).addTo(event.map);
    }
    // pop up quand on dépasse le nombre de points 
  }


}
