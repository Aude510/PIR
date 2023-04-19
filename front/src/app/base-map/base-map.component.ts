import {Component, EventEmitter, Output} from '@angular/core';
import * as L from "leaflet";
import {LeafletMouseEvent} from "leaflet";
import {MapMouseEvent} from "../../model/MapMouseEvent";
import {MapService} from "../services/map.service";
import { MapToDiscretCoordService } from '../services/map-to-discret-coord.service';

/**
 * This is a component to adapt leaflet in the angular architecture.
 * It basically creates an event to which other components can subscribe to.
 * To use it:
 * <app-base-map (leafletMouseEvent)="callbackfn()"></app-base-map>
 */
@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.sass']
})
export class BaseMapComponent {
  private MTDCS: MapToDiscretCoordService

  @Output() leafletMouseEvent: EventEmitter<MapMouseEvent> = new EventEmitter();

  constructor(private mapService: MapService, MTDCS: MapToDiscretCoordService) { 
    this.MTDCS = MTDCS;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key == 'a') {
        MTDCS.computeArea(51.5, -0.09);
      }
    });
  }
  private initMap() {
    this.mapService.map = L.map('map', {
      center: [ 51.5, -0.09 ],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.mapService.map.on('click', (e: LeafletMouseEvent) => this.onMapClick(e));
    tiles.addTo(this.mapService.map);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  onMapClick(e: LeafletMouseEvent) {
    // @ts-ignore as when the component is rendered a map will be here
    this.leafletMouseEvent.emit({map: this.mapService.map, event: e});
    this.mapService.notifyMapClicked(e);
  }
}
