import { Injectable } from '@angular/core';
import {Drone} from "../../model/Drone";
import {ServerMessage} from "../../model/ServerMessage";
import {ServerRequest} from "../../model/ServerRequest";
import {Path} from "../../model/Path";
import {Subject} from "rxjs";
import {Status} from "../../model/Status";
import {Zone} from "../../model/Zone";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  public socket: WebSocket | undefined;

  private pop_up_status_subscription: Subject<ServerMessage<any>> | undefined;
  private map_update_subscription: Subject<ServerMessage<any>> | undefined;
  private statusReceive : Subject<ServerMessage<any>>;

  SubToPopUp(){
    if(!this.pop_up_status_subscription){
      this.pop_up_status_subscription = new Subject<ServerMessage<any>>();
    }
    return this.pop_up_status_subscription;
  }
  SubToMapUpdate(){
    if(!this.map_update_subscription){
      this.map_update_subscription = new Subject<ServerMessage<any>>();
    }
    return this.map_update_subscription;
  }


  public constructor() {
    this.statusReceive = new  Subject<ServerMessage<any>>();
    console.log("Initialising the web socket\n");
    try {
      this.socket = new WebSocket("ws://192.168.43.17:80");

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
          .catch((e) => {
            console.log("ERRROR : "+e);
          })

        /*this.sendDeleteDrone(dd)
          .then((data) => console.log(data))
          .catch((e) => console.log(e));
        */
        // @ts-ignore
        this.socket.onmessage = (event : ServerMessage<any>) => {
          const received_message = JSON.parse(event.data);
          console.log("Réception d'un message:"+ received_message + " " +event.data.type);
          // TODO: check if is the right response
          this.demultiplexMessage(received_message);
        }
      }

      this.socket.onclose = (event) => {
          console.log("Communication with the server is lost");
      }

    }
  }

  private demultiplexMessage(event: ServerMessage<any>) {
    switch (event.type) {
      case "answer_path":
      case "delete_zone":
      case "block_zone":
      case "new_drone":
      case "delete_drone":
      case "get_status":
        console.log("ALED")
        this.statusReceive.next(event.data);
        break;

    }
  }

  sendNewDrone(drone : Drone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Drone> = {type: "new_drone", data: drone};
    console.log("Sending a new drone");
    this.socket?.send(JSON.stringify(data));

    if(this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e)=> {
          console.log("Received a message at sendNewDrone")
          this.statusReceive.unsubscribe()
          //console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
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

    if(this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e)=> {
          console.log("Received a message at sendDeleteDrone")
          this.statusReceive.unsubscribe()
          console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), 5000);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }

  sendBlockedZone(zone: Zone): Promise<ServerMessage<Drone>>{
    const data: ServerRequest<Zone> = {type: "block_zone", data:zone};
    console.log("Blocking a new zone");
    this.socket?.send(JSON.stringify(data));

    if(this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e)=> {
          console.log("Received a message at blocked zone")
          this.statusReceive.unsubscribe()
          console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), 5000);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }
  sendAnswerPath(response: boolean): Promise<void>{
    console.log("Answering the path");
    this.socket?.send(JSON.stringify(response));
    if(this.socket) {
      return new Promise((resolve, reject) => {
        resolve();
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), 5000);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }


}