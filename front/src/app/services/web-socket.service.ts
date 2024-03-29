import { Injectable } from '@angular/core';
import {Drone} from "../../model/Drone";
import {ServerMessage} from "../../model/ServerMessage";
import {ServerRequest} from "../../model/ServerRequest";
import {Path} from "../../model/Path";
import {Subject} from "rxjs";
import {Zone} from "../../model/Zone";
import {Point} from "../../model/Point";
import {Status} from "../../model/Status";
import {OwnerService} from "./owner.service";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private TIMEOUT : number = 20000;  // Time before rejection
  private isReceiving : boolean = false;
  public socket: WebSocket | undefined;
  private drone: Drone | undefined;
  private pop_up_status_subscription: Subject<ServerMessage<Status>> = new Subject<ServerMessage<Status>>();
  private map_update_subscription = new Subject<Status>();
  private statusReceive = new Subject<ServerMessage<any>>(); // Drone or Zone
  private messageReceived:boolean = false;

  subToPopUp() {
    if (!this.pop_up_status_subscription) {
      this.pop_up_status_subscription = new Subject<ServerMessage<any>>();
    }
    return this.pop_up_status_subscription;
  }

  subToMapUpdate() {
    return this.map_update_subscription;
  }

  public constructor(private owner: OwnerService) {
    console.log("Initialising the web socket\n");
    this.connect();
    console.log("Connection complete");
  }
  async connect(){
    let isConnected : boolean =false;
    while(!isConnected){
      try {
        this.socket = new WebSocket("ws://localhost:8080");
        isConnected = true;
        console.log("try");

      } catch (e) { // webSocket only throws syntax error
        this.socket = undefined
        console.error("Error parsing the URI");
        isConnected = false;
      }
      await new Promise(f => setTimeout(f, 200));
    }
    if(this.socket){
      this.socket.onopen = (event) => {
        this.socket?.send(JSON.stringify({type: "connect", data: {owner: this.owner.getOwner()}}));
        if(isConnected){
          console.log("Connected to the server !\n");
          // this.simulationCase1();

        }
      }

      console.log("END");
    } else {
      console.log("Socket is still not open");
    }
    if (this.socket) {
      // @ts-ignore
      this.socket.onmessage = (event: ServerMessage<any>) => this.messageHandler(event);
      this.socket.onerror = (event) => {
        console.log("Communication with the server ERRORED");
        isConnected = false;
        this.connect();
      }
      this.socket.onclose = (event) => {
        console.log("Communication with the server is lost"); // Todo : Reconnect through the connect method (also needs to be implemented)
        isConnected = false;
        this.connect();
      }
    }
  }

  private simulationCase1() {
    const dd = new Drone("Cador",  this.owner.getOwner(), 10, new Path([]), Point.fromTuple(10, 10), Point.fromTuple(50, 50)); // TEST CASE
    this.sendNewDrone(dd)
      .then((data) => console.log(data))
      .catch((e) => {
        console.log("ERRROR : " + e);
      })
    this.drone = dd;

    const z = {
      "square": {
        "points": [
          {
            "x": 115,
            "y": 421
          },
          {
            "x": 204,
            "y": 421
          },
          {
            "x": 204,
            "y": 365
          },
          {
            "x": 115,
            "y": 365
          }
        ]
      }
    };
    // @ts-ignore
    this.sendBlockedZone(z);
  }

  private messageHandler(event: ServerMessage<any>) {
    const received_message: string = event.data;
    const mes: ServerMessage<any> = JSON.parse(received_message);
    this.messageReceived = true;
    console.log("Réception d'un message:" + received_message + " " + mes.type);
    // TODO: check if is the right response
    switch (mes.type) {
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
        // @ts-ignore
        this.map_update_subscription.next(Status.formServer(mes.data));
        break;

    }
  }



  sendNewDrone(drone: Drone): Promise<ServerMessage<Drone>> {
    const data: ServerRequest<Drone> = {type: "new_drone", data: drone};
    console.log("Sending a new drone");
    console.log(JSON.stringify(data));
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at sendNewDrone")
          // this.statusReceive.unsubscribe()
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
    console.log(JSON.stringify(data))
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at sendDeleteDrone")
          // this.statusReceive.unsubscribe()
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

  sendBlockedZone(zone: Zone): Promise<ServerMessage<Zone>> {
    const data: ServerRequest<Zone> = {type: "block_zone", data: zone};
    console.log("Blocking a new zone");
    console.log(zone);
    this.socket?.send(JSON.stringify(data));

    if (this.socket) {
      return new Promise((resolve, reject) => {
        this.statusReceive.subscribe((e) => {
          console.log("Received a message at blocked zone")
          // this.statusReceive.unsubscribe()
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
