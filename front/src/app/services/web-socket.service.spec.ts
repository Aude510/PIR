import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';
import {ServerMessage} from "../../model/ServerMessage";
import {Drone} from "../../model/Drone";
import {Path} from "../../model/Path";
import {Point} from "../../model/Point";
import {Owner} from "../../model/Owner";
import {v4 as uuidv4} from "uuid";

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('aled', () => {
    const msg : ServerMessage<Drone> = {type:"new_drone",
      status: 400,
      data :new Drone("Cador", new Owner(uuidv4()),10,new Path([]),Point.fromTuple(50,50),Point.fromTuple(10,10))
    }
    // @ts-ignore
    service.statusReceive.subscribe((e) => console.log(e.data))
    // @ts-ignore
    service.statusReceive.next(msg)
    expect(service).toBeTruthy();
  });
});
