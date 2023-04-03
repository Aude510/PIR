import { Injectable } from '@angular/core';
import * as L from "leaflet";
import {Subject} from "rxjs";
import {LeafletMouseEvent} from "leaflet";

/**
 * As all angular services, this is a singleton. As such we can share the subscription of
 * a single map though all the components on the page.
 * Just subscribe to the map click event to receive updates.
 * You can interact with the map instance accessing the map property directly.
 * @remarks
 * Take into account that the map instance is shared and will be cleared when the component is destroyed
 * This service can be initialised independently form the map, so map might be undefined at the start of the application
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
  public map: L.Map | undefined;
  private sub: Subject<L.LeafletMouseEvent> = new Subject();
  constructor() { }

  notifyMapClicked(e: L.LeafletMouseEvent) {
    this.sub.next(e);
  }
  onMapClicked(): Subject<LeafletMouseEvent> {
    return this.sub;
  }
}
