import { TestBed } from '@angular/core/testing';

import { WebSocketService } from './web-socket.service';
import {ServerMessage} from "../../model/ServerMessage";
import {Drone} from "../../model/Drone";
import {Path} from "../../model/Path";

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
      data :new Drone(10, "Cador", {ID:69},10,new Path([]),{x:50,y:50},{x:50,y:50})
    }
    // @ts-ignore
    service.statusReceive.subscribe((e) => console.log(e.data))
    // @ts-ignore
    service.statusReceive.next(msg)
    expect(service).toBeTruthy();
  });
});
