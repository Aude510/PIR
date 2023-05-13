import { Component } from '@angular/core';
import {WebSocketService} from "../services/web-socket.service";
import {Zone} from "../../model/Zone";

@Component({
  selector: 'app-zone-informations',
  templateUrl: './zone-informations.component.html',
  styleUrls: ['./zone-informations.component.sass']
})
export class ZoneInformationsComponent {

  constructor(private ws: WebSocketService,private currentZone : Zone) {
    // Récupérer la zone sélectionnée !
    ws.sendBlockedZone(currentZone).then((r) => console.log(r));
  }
}
