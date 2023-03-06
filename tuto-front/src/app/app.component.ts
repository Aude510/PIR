import { Component } from '@angular/core';
import {LeafletMouseEvent} from "leaflet";
import {BaseMapComponent} from "./base-map/base-map.component";
import {MapMouseEvent} from "./model/MapMouseEvent";
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'tuto-front';

  testMap(e: MapMouseEvent) {
    console.log("event reveices")
    L.popup().setLatLng(e.event.latlng)
      .setContent("You clicked the map at " + e.event.latlng.toString())
      .openOn(e.map);
  }
}
