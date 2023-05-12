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

  public socket: WebSocket | undefined;
  private drone: Drone |undefined;
  private pop_up_status_subscription: Subject<ServerMessage<Status>> | undefined;
  private map_update_subscription = new Subject<Status>();
  private statusReceive: Subject<ServerMessage<any>>;

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
    this.statusReceive = new Subject<ServerMessage<any>>();
    console.log("Initialising the web socket\n");
    try {
       this.socket = new WebSocket("ws://192.168.43.17:80");
      // s.onopen = () => this.socket = s;
      //
      // s.onerror = () => this.socket = undefined;
    } catch (e) { // webSocket only throws syntax error
      this.socket = undefined
      console.error("Error parsing the URI");
    }

    if (this.socket != undefined) {

      this.socket.onopen = (event) => {
        console.log("Connected to the server !\n")
        let message: ServerConnect = {type: "connect", data: {owner: "dsfg"}};
        this.socket?.send(JSON.stringify(message));

        const dd = new Drone("Cador", {ID:"q,kdfnqdsjnvjsdn"},10,new Path([]),Point.fromTuple(10,10),Point.fromTuple(50,50));
        this.sendNewDrone(dd)
          .then((data) => console.log(data))
          .catch((e) => {
            console.log("ERRROR : "+e);
          })
        this.drone = dd;



        // @ts-ignore
        this.socket.onmessage = (event: ServerMessage<any>) => {

          const received_message = event.data;
          console.log("Réception d'un message:" + received_message + " " + event.data.type);
          // TODO: check if is the right response
          this.demultiplexMessage(JSON.parse(event.data));
        }
      }

      this.socket.onclose = (event) => {
        console.log("Communication with the server is lost");
      }

      this.subToMapUpdate().subscribe((v) => {
        console.log("cqsjyhegdfhoil");
      })
    } else {
      console.log("ALLLLLLLLLLLLLLLLLLLLLLEEEEEEEEEEEEEEEEEEED");
    }
  }

  private demultiplexMessage(event: ServerMessage<any>) {
    switch (event.type) {
      case "answer_path":
      case "delete_zone":
      case "block_zone":
      case "new_drone":
      case "delete_drone":
        console.log("ALED")
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
        setTimeout(() => reject(new Error("Timeout")), 50000);
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
        setTimeout(() => reject(new Error("Timeout")), 50000);
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
        setTimeout(() => reject(new Error("Timeout")), 50000);
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
        setTimeout(() => reject(new Error("Timeout")), 50000);
      })
    } else {
      return new Promise((resolve, reject) => reject("Socket is not open"));
    }
  }
  suppDD(){
    if(this.drone)
      this.sendDeleteDrone(this.drone);
  }
}
