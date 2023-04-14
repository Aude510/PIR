import { Component } from '@angular/core';
import { LatLng, LayerGroup } from 'leaflet';
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

  private listePoints: Array<LatLng> = []; // ne pas oublier d'init 
  private listeMarkers: Array<L.Marker> = [];
  private map: any = null; 
  private polygon: any = null; 
  private layer: LayerGroup; 
  private tailleSquare: number = 4 ; 

  public constructor(private mapService:MapService, private webSocket: WebSocketService) {
    this.mapService.onMapClickedTakeSubscription().subscribe((e) => {
      this.addPoint(e);
    })
    this.layer = new L.LayerGroup();
    this.mapService.addToMap(this.layer);    
  }

  private checkCorrectZone(listePoints: Array<LatLng>){
    // vérifier que les points ont été rentrés dans l'ordre 
    // checker si les droites entre les points se croisent 
  }



  addPoint(event: L.LeafletMouseEvent){

    // TODO si un connard clique pas dans l'ordre    


    // let scope {}
    // var scope par fonction (à éviter)
    // attention const = final en java, pas constante 
    
    
    // assignation de la map : 
    if (this.map==null){
      this.map=this.mapService.map;
    }

    if (this.listePoints.length<this.tailleSquare-1){ // premiers points 
      // add point à la liste 
      this.listePoints.push(event.latlng); 
      /* add marqueur sur la map à la position du point */ 
      let marker: L.Marker = new L.Marker(event.latlng); 
      this.listeMarkers.push(marker); 
      marker.addTo(this.layer); 
    }
    else if (this.listePoints.length==this.tailleSquare-1){ // dernier point 
      // add point à la liste 
      this.listePoints.push(event.latlng); 
      /* add marqueur sur la map de l'event à la position du point */ 
      let marker: L.Marker = new L.Marker(event.latlng); 
      this.listeMarkers.push(marker); 
      marker.addTo(this.layer); 
      // tracer polygone 
      this.polygon = L.polygon(this.listePoints);
      this.polygon.addTo(this.layer); 
    } 
    else {
      console.log(this.listePoints.length);
      alert("veuillez valider ou retracer la zone");
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
    if (this.listePoints.length != this.tailleSquare){
      alert("veuillez tracer une zone valide avant de valider : " + this.tailleSquare + " points.")
    } else {
      console.log("envoi des données au serveur");
      let square: Square = {points:this.listePoints.map((p) => new Point(p))};
      // TODO envoyer square au back 
      this.deleteZone();
    }
   }

}
