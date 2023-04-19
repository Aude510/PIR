import { Component } from '@angular/core';
import { LatLng, LayerGroup } from 'leaflet';
import * as L from "leaflet";
import { Square } from 'src/model/Square';
import { Point } from 'src/model/Point';
import { MapService } from '../services/map.service';
import {WebSocketService} from "../services/web-socket.service";



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

  // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
  // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function/16725715#16725715
  private intersects(a: number,b: number,c: number,d: number,p: number,q: number,r: number,s: number) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };


  // return false si la zone est incorrecte (deux triangles collés au lieu d'un polygone à 4 côtés)
  private checkWrongZone(listePoints: Array<LatLng>){
    // vérifier que les points ont été rentrés dans l'ordre
    // côté entre P0 et P3 et entre P1 et P2
    // si ils se croisent alors la zone est mal formée
    let croisent:boolean = this.intersects(listePoints[0].lat,listePoints[0].lng,
                                            listePoints[3].lat,listePoints[3].lng,
                                            listePoints[1].lat,listePoints[1].lng,
                                            listePoints[2].lat,listePoints[2].lng);
    return croisent;
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
    } else if (this.listePoints.length==this.tailleSquare-1) { // dernier point
      // add point à la liste
      this.listePoints.push(event.latlng);
      /* add marqueur sur la map de l'event à la position du point */
      let marker: L.Marker = new L.Marker(event.latlng);
      this.listeMarkers.push(marker);
      marker.addTo(this.layer);
      // tracer polygone
      this.polygon = L.polygon(this.listePoints);
      this.polygon.addTo(this.layer);
    } else {
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
    } else if (this.checkWrongZone(this.listePoints)){
      alert("veuillez tracer une zone sans croisement des lignes");
    }
     else {
      console.log("envoi des données au serveur");
      let square: Square = {points:this.listePoints.map((p) => new Point(p))};
      // TODO envoyer square au back
      this.deleteZone();
    }
   }

}
