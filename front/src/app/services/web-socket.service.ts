import { Injectable } from '@angular/core';
import {Drone} from "../../model/Drone";
import {ServerMessage} from "../../model/ServerMessage";
import {ServerRequest} from "../../model/ServerRequest";
import {Path} from "../../model/Path";
import {Subject} from "rxjs";
import {Status} from "../../model/Status";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socket: WebSocket | undefined;

  public statusSubscription: Subject<Status> = new Subject<Status>(); // Créer un subscribe par component |  getter ?
  private popUpSubscription: Subject<Status> | undefined;
  subToPopUp(){
    if(!this.popUpSubscription){
      this.popUpSubscription = new Subject<Status>();
    }
    return this.popUpSubscription;
  }


  public constructor() {
    console.log("Initialising the web socket\n");
    try {
      this.socket = new WebSocket("wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self");

    } catch (e) {
      this.socket = undefined
      console.error("Error initialising the web socket");
    }

    if(this.socket != undefined) {
      this.socket.onopen = (event) => {

        console.log("Connected to the server !\n")
        const dd = new Drone(10, "Cador", {ID:69},10,new Path([]),{x:50,y:50},{x:50,y:50});
        this.sendNewDrone(dd)
          .then((data) => console.log(data))
          .catch((e) => console.log(e));
        this.sendDeleteDrone(dd)
          .then((data) => console.log(data))
          .catch((e) => console.log(e));

        // @ts-ignore
        this.socket.onmessage = (event : ServerMessage<any>) => {
          console.log(event.data)
          // TODO: check if is the right response
          switch (event.type){
            case "answer_path":
              break
            case "delete_zone":
              break
            case "block_zone":
              break
            case "new_drone":
              break
            case "delete_drone":
              break
            case "get_status":
              break
            case "pop_up":
              this.popUpSubscription?.next(event.data)
              break


          }

        }

      }
      this.socket.onclose = (event) => {
          console.log("Communication with the server is lost");

      }
    }
  }

  sendNewDrone(drone : Drone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Drone> = {type: "new_drone", data: drone};
    console.log("Sending a new drone");
    this.socket?.send(JSON.stringify(data));
    if(this.socket) {
      return new Promise((resolve, reject) => {
        // @ts-ignore
        this.socket.onmessage = (event) => {
          console.log(event.data)
          // TODO: check if is the right response
          resolve(event.data);
        }
        setTimeout(() => reject(new Error("Timeout")), 5000);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }

  sendDeleteDrone(drone: Drone): Promise<ServerMessage<Drone>>{
    const data: ServerRequest<Drone> = {type: "delete_drone", data: drone};
    console.log("Deleting the drone");
    this.socket?.send(JSON.stringify(data));
    if(!this.socket){
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
    return  new Promise<ServerMessage<Drone>>(( resolve,reject ) => {
        // @ts-ignore
      this.socket.onmessage = (event) => {console.log(event.data);resolve(event.data);}
      })
  }

}
