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
  private listeMarkers: Array<L.Marker> = [];
  private map: any = null; 
  private polygon: any = null; 

  addPoint(event: MapMouseEvent){
    let tailleSquare: number = 4; 

    // let scope {}
    // var scope par fonction (à éviter)
    // attention const = final en java, pas constante 
    
    
    // assignation de la map : 
    if (this.map==null){
      this.map=event.map;
    }

    if (this.listePoints.length<tailleSquare){
      // add point à la liste 
      this.listePoints.push(event.event.latlng); 
      /* add marqueur sur la map de l'event à la position du point */ 
      let marker: L.Marker = new L.Marker(event.event.latlng); 
      this.listeMarkers.push(marker); 
      this.map.addLayer(marker);
    } else {
      alert("veuillez valider ou retracer la zone");
    }

    if (this.listePoints.length==tailleSquare && this.polygon==null){
      // tracer polygone 
      this.polygon = L.polygon(this.listePoints);
      this.map.addLayer(this.polygon);
    }
  }

  deleteZone(){
    console.log("effacement des points");
    this.listePoints=[];
    // virer les marqueurs 
    for (let marker of this.listeMarkers){
      this.map.removeLayer(marker);
    }
    this.listeMarkers = [];
    // virer le polygone
    if (this.polygon!=null){
      this.map.removeLayer(this.polygon);
    }
    this.polygon=null; 
  }

  sendToBack(){
    console.log("envoi des données au serveur");
    // TODO 

    this.backToMain();
  }

  backToMain(){
    // TODO 
  }


}
