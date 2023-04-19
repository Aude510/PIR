import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDroneComponent } from './add-drone.component';
import {Drone} from "../../model/Drone";
import {Point} from "../../model/Point";
import {latLng, Layer, LeafletMouseEvent} from "leaflet";
import {WebSocketService} from "../web-socket.service";
import {ServerMessage} from "../../model/ServerMessage";
import * as L from "leaflet";
import {Subject} from "rxjs";
import {MapService} from "../services/map.service";
import {Injectable} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Path} from "../../model/Path";
@Injectable()
class WebSocketServiceMockResolve {
  public sendNewDrone(drone: Drone): Promise<ServerMessage<Drone>> {
    return new Promise( (resolve) => {
        resolve({status: 42, data: drone});
    });
  }
}
@Injectable()
class MapServiceMockResolve {
  public map: L.Map | undefined;
  private sub: Subject<L.LeafletMouseEvent> = new Subject();
  private componentLayers: Layer[] = [];
  constructor() {
  }

  notifyMapClicked(e: L.LeafletMouseEvent) {
    this.sub.next(e);
  }

  onMapClickedTakeSubscription(): Subject<LeafletMouseEvent> {
    this.sub = new Subject();
    return this.sub;
  }

  clearMap() {
    this.componentLayers.forEach((layer) => {
      layer.remove();
      this.componentLayers.pop();
    });
  }

  addToMap(layer: Layer) {
    this.componentLayers.push(layer);
  }
}

describe('AddDroneComponent', () => {
  let component: AddDroneComponent;
  let fixture: ComponentFixture<AddDroneComponent>;
  let drone = new Drone(
    'toto',
    {id: 5},
    1,
    new Path([]),
    new Point(latLng(0,0)),
    new Point(latLng(0,0))
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDroneComponent ],
      imports: [FormsModule],
      providers: [
        {provide: WebSocketService, useValue: new WebSocketServiceMockResolve},
        {provide: MapService, useValue: new MapServiceMockResolve}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDroneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    drone = new Drone(
      'toto',
      {id: 5},
      1,
      new Path([Point.fromTuple(1,2), Point.fromTuple(3,5), Point.fromTuple(6,9)]),
      new Point(latLng(0,0)),
      new Point(latLng(0,0))
    );

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial state should be insert', () => {
    expect(component.pathDefinedByServer).toEqual('input');
  })

  it('should add a new drone', () => {
    expect(component.pathDefinedByServer).toEqual('input');
    component.sendDrone(drone);
    expect(component.pathDefinedByServer).toEqual('loading');
    expect(component.drone).toEqual(drone);
  })

  // @ts-ignore
  it('should load and then preview', async () => {
    let p = component.sendDrone(drone);
    expect(component.pathDefinedByServer).toEqual('loading');
    expect(component.drone).toEqual(drone);
    // @ts-ignore
    let spy = spyOn(component,'displayPath');
    await p;
    expect(component.pathDefinedByServer).toEqual('confirm');
    expect(component.drone).toEqual(drone);
    expect(spy.calls.count()).toEqual(1);
  })

  /*
      return new Promise((resolve, reject) => {
      drone = new Drone(
        'toto',
        {ID: 5},
        1,
        new Path([Point.fromTuple(1,2), Point.fromTuple(3,5), Point.fromTuple(6,9)]),
        new Point(latLng(0,0)),
        new Point(latLng(0,0))
      );
      setTimeout(() => {
        resolve({status: 42, data: drone});
      }, 5000)
    });
   */
});
