import { Component } from '@angular/core';
import {Drone} from "../../model/Drone";

@Component({
  selector: 'app-drone-informations',
  templateUrl: './drone-informations.component.html',
  styleUrls: ['./drone-informations.component.sass']
})
export class DroneInformationsComponent {
  public droneID: number | undefined
  public droneName: string | undefined
  public droneStart: number[] | undefined
  public droneEnd: number[] | undefined

  public drone : Drone | undefined

  getDrone(){ // Send a message to the webSocket to get the drone's information
    this.drone =new Drone(1,"Cador",{ID: 4},0,{points:[]},{x:0,y:0},{x:48,y:52})
  }

  deleteDrone(){  // Send a message to the webSocket to remove the drone from the map

  }
}
