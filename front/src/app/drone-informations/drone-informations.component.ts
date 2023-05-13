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

  constructor(private webSocketService: WebSocketService,private drone : Drone) { // TODO: Add drone to the constructor
    // Récupérer le drone !
    console.log("Drone information ready")

  }

  deleteDrone(){  // Send a message to the webSocket to remove the drone from the map
    console.log("Deleting Drone " + this.drone.id);
    if(this.drone){
      this.webSocketService.sendDeleteDrone(this.drone).then(r => console.log(r));
    }
  }
}
