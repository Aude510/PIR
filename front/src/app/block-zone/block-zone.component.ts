import { Component } from '@angular/core';
import { LatLng } from 'leaflet';
import * as L from "leaflet";
import { Square } from 'src/model/Square';
import { Point } from 'src/model/Point';
import { MapService } from '../services/map.service';
import { WebSocketService } from '../web-socket.service';



@Component({
  selector: 'app-block-zone',
  templateUrl: './block-zone.component.html',
  styleUrls: ['./block-zone.component.sass']
})
export class BlockZoneComponent {



  public constructor(private mapService:MapService, private webSocket: WebSocketService) {
    this.mapService.onMapClicked().subscribe(this.addPoint);
    
  }

  public ngOnInit(): void {
  }


  private listePoints: Array<LatLng> = []; // ne pas oublier d'init 
  private listeMarkers: Array<L.Marker> = [];
  private map: any = null; 
  private polygon: any = null; 

  addPoint(event: L.LeafletMouseEvent){

    // TODO si un connard clique pas dans l'ordre    

    let tailleSquare: number = 4; 

    // let scope {}
    // var scope par fonction (à éviter)
    // attention const = final en java, pas constante 
    
    
    // assignation de la map : 
    if (this.map==null){
      this.map=this.mapService.map;
    }

    if (this.listePoints.length<tailleSquare){
      // add point à la liste 
      this.listePoints.push(event.latlng); 
      /* add marqueur sur la map de l'event à la position du point */ 
      let marker: L.Marker = new L.Marker(event.latlng); 
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
    let square: Square = {points:this.listePoints.map((p) => new Point(p))};
    // TODO envoyer square au back 
  }

}
