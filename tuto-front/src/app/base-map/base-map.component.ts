import {Component, EventEmitter, Output} from '@angular/core';
import * as L from "leaflet";
import {LeafletMouseEvent} from "leaflet";
import {MapMouseEvent} from "../model/MapMouseEvent";

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.sass']
})
export class BaseMapComponent {
  private map: any;
  private popup: L.Popup | undefined;

  @Output() leafletMouseEvent: EventEmitter<MapMouseEvent> = new EventEmitter();
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 51.5, -0.09 ],
      zoom: 14
    });

    this.map.on('click', (e: LeafletMouseEvent) => this.onMapClick(e));
    this.popup = L.popup();

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    const marker = L.marker([51.5, -0.09]).addTo(this.map);

    const circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(this.map);

    const polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(this.map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");
  }
  ngAfterViewInit(): void {
    this.initMap();
  }


  onMapClick(e: LeafletMouseEvent): void {
    this.leafletMouseEvent.emit({map: this.map, event: e});
    // L.popup().setLatLng(e.latlng)
    //   .setContent("You clicked the map at " + e.latlng.toString())
    //   .openOn(this.map);
  }

  testEvent(e: any): void {
    console.log("event received");
  }
}
