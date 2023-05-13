import { Injectable } from '@angular/core';
import {Drone} from "../../model/Drone";
import {ServerMessage} from "../../model/ServerMessage";
import {ServerRequest} from "../../model/ServerRequest";
import {Path} from "../../model/Path";
import {Subject} from "rxjs";
import {Zone} from "../../model/Zone";
import {Point} from "../../model/Point";
import {Status} from "../../model/Status";
import {ServerConnect} from "../../model/ServerConnect";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private TIMEOUT : number = 20000;  // Time before rejection

  public socket: WebSocket | undefined;
  private drone: Drone |undefined;
  private pop_up_status_subscription: Subject<ServerMessage<Status>> = new Subject<ServerMessage<Status>>();
  private map_update_subscription = new Subject<Status>();
  private statusReceive: Subject<ServerMessage<any>> = new Subject<ServerMessage<any>>();

  subToPopUp() {
    if (!this.pop_up_status_subscription) {
      this.pop_up_status_subscription = new Subject<ServerMessage<any>>();
    }
    return this.pop_up_status_subscription;
  }

  subToMapUpdate() {
    return this.map_update_subscription;
  }

  public constructor() {
    console.log("Initialising the web socket\n");
    this.connect();
    console.log("Connection complete");
  }
  connect(){
    let isConnected : boolean =false;
    while(!isConnected){ // Replace with timeout maybe
      try {
        this.socket = new WebSocket("ws://192.168.43.17:80");
        isConnected = true;

      } catch (e) { // webSocket only throws syntax error
        this.socket = undefined
        console.error("Error parsing the URI");
        isConnected = false;
      }
    }
    if(this.socket){

      this.socket.onopen = (event) => {

        this.socket?.send(JSON.stringify({type: "connect", data: {owner: "dsfg"}}));
        console.log("Connected to the server !\n");

        const dd = new Drone("Cador", {ID:"q,kdfnqdsjnvjsdn"},10,new Path([]),Point.fromTuple(10,10),Point.fromTuple(50,50)); // TEST CASE
        this.sendNewDrone(dd)
          .then((data) => console.log(data))
          .catch((e) => {
            console.log("ERRROR : "+e);
          })
        this.drone = dd;

      }
    } else {
      console.log("Socket is still not open");
    }
      // @ts-ignore
      this.socket.onmessage = (event: ServerMessage<any>) =>  this.messageHandler(event);

      // @ts-ignore
      this.socket.onclose = (event) => {
        console.log("Communication with the server is lost"); // Todo : Reconnect through the connect method (also needs to be implemented)
        this.connect();
      }

    }

  private messageHandler(event: ServerMessage<any>) {
    const received_message = event.data;
    console.log("Réception d'un message:" + received_message + " " + event.data.type);
    // TODO: check if is the right response
    switch (event.type) {
      case "answer_path":
      case "delete_zone":
      case "block_zone":
      case "new_drone":
      case "delete_drone":
        console.log("Status Receive")
        this.statusReceive.next(event.data);
        break;
      case "pop_up":
        console.log("Pop-up");
        this.pop_up_status_subscription?.next(event.data);
        break;
      case "get_status":
        console.log("Map Update");
        this.map_update_subscription.next(event.data);
        break;

    }
  }




  sendNewDrone(drone: Drone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Drone> = {type: "new_drone", data: drone};
    console.log("Sending a new drone");
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at sendNewDrone")
          this.statusReceive.unsubscribe()
          //console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), this.TIMEOUT);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }

  }

  sendDeleteDrone(drone: Drone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Drone> = {type: "delete_drone", data: drone};
    console.log("Deleting the drone");
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at sendDeleteDrone")
          this.statusReceive.unsubscribe()
          console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), this.TIMEOUT);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }

  sendBlockedZone(zone: Zone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Zone> = {type: "block_zone", data: zone};
    console.log("Blocking a new zone");
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at blocked zone")
          this.statusReceive.unsubscribe()
          console.log(e.data)
          resolve(e);
        })
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), this.TIMEOUT);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }

  sendAnswerPath(response: boolean): Promise<void> {
    console.log("Answering the path");
    this.socket?.send(JSON.stringify(response));
    if (this.socket) {
      return new Promise((resolve, reject) => {
        resolve();
        // @ts-ignore
        setTimeout(() => reject(new Error("Timeout")), this.TIMEOUT);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }
  suppDD() {
    if (this.drone)
      this.sendDeleteDrone(this.drone);
  }
}
