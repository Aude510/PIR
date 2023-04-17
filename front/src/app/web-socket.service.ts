import { Injectable } from '@angular/core';
import {Drone} from "../model/Drone";
import {ServerMessage} from "../model/ServerMessage";
import {ServerRequest} from "../model/ServerRequest";
import {Point} from "../model/Point";
import {latLng} from "leaflet";
import {Path} from "../model/Path";
;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socket: WebSocket | undefined;
  public constructor() {
    console.log("Initialising the web socket\n");
    try {
      this.socket = new WebSocket("ws://192.168.43.17/:80");
    } catch (e) {
    console.error("Error initialising the web socket");
    }

    if(this.socket != undefined) {
      this.socket.onopen = (event) => {
        console.log("Connected to the server !\n");
        this.sendNewDrone(new Drone("Cador", {ID: 69}, 10, new Path([]), Point.fromTuple(10, 10), Point.fromTuple(50,50)))
          .then((data) => console.log(data))
          .catch((e) => console.log(e));
      }
    }
  }

  sendNewDrone(drone : Drone): Promise<ServerMessage<Drone>> {

    const data: ServerRequest<Drone> = {type: "new_drone", data: drone};
    this.socket?.send(JSON.stringify(data));
    if(this.socket) {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        this.socket.onmessage = (event) => {
          console.log(event.data)
          resolve(event.data);
        }
      })
    }
    return new Promise((resolve, reject) => reject("Unable to open socket"));
  }

  sendDeleteDrone(drone: Drone): Promise<ServerMessage<Drone>>{
    const data: ServerRequest<Drone> = {type: "delete_drone", data: drone};
    this.socket?.send(JSON.stringify(data));
    if(!this.socket){
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
    return  new Promise<ServerMessage<Drone>>(
      ( resolve,reject ) => {
      // @ts-ignore
      this.socket.onmessage = (event) => {console.log(event.data);resolve(event.data);}
      })
  }


/*

  */




}
