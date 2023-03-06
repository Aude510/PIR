import {LeafletMouseEvent} from "leaflet";
import * as L from 'leaflet';

export interface MapMouseEvent {
  map: L.Map,
  event: LeafletMouseEvent
}
