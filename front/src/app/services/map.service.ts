import { Injectable } from '@angular/core';
import * as L from "leaflet";
import {Subject} from "rxjs";
import {Layer, LayerGroup, LeafletMouseEvent} from "leaflet";
import {Drone} from "../../model/Drone";

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
  private componentLayers: Layer[] = [];
  constructor() { }

  notifyMapClicked(e: L.LeafletMouseEvent) {
    this.sub.next(e);
  }

  /**
   * Creates a new subject to unsubscribe all other subscribed components.
   * You basically get control of the map component
   * Il also clears the map
   */
  onMapClickedTakeSubscription(): Subject<LeafletMouseEvent> {
    this.sub = new Subject();
    return this.sub;
  }

  clearMap() {
    this.componentLayers.forEach((layer) => {
      layer.remove();
      this.componentLayers.pop();
    });
    console.log("suppression des layers");
  }

  addToMap(layer: Layer) {
    if (this.map) {
      this.componentLayers.push(layer);
      layer.addTo(this.map);
    } else {
      alert("The map is not initialised, please refresh and try again");
    }
  }



  addDroneToMap(drone: Drone, layer: LayerGroup) {
    L.circleMarker(drone.start.toLatLng(),{color: 'green'}).addTo(layer);
    L.circleMarker(drone.destination.toLatLng(), {color: 'blue'}).addTo(layer);
    const path = drone.path.toLatLang();
    L.polyline(path).addTo(layer);
  }

  insertInMap(layer: Layer) {
    if (this.map) {
      layer.addTo(this.map);
    } else {
      alert("The map is not initialised, please refresh and try again");
    }
  }
}
