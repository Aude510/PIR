import {Component, Injectable} from '@angular/core';
import {Drone} from "../../model/Drone";
import {WebSocketService} from "../services/web-socket.service";


@Component({
  selector: 'app-drone-informations',
  templateUrl: './drone-informations.component.html',
  styleUrls: ['./drone-informations.component.sass'],
  providers:  []


})

@Injectable()
export class DroneInformationsComponent {
  public droneID: number | undefined
  public droneName: string | undefined
  public droneStart: number[] | undefined
  public droneEnd: number[] | undefined

  public drone : Drone | undefined


  constructor(private webSocketService: WebSocketService) { // TODO: Add drone to the constructor
    console.log("Drone information ready")

  }

  deleteDrone(){  // Send a message to the webSocket to remove the drone from the map
    console.log("Deleting Drone " + this.droneID);
    if(this.drone){
      this.webSocketService.sendDeleteDrone(this.drone).then(r => console.log(r));
    }
  }
}
