import {LeafletMouseEvent} from "leaflet";
import * as L from 'leaflet';

export type MapMouseEvent = {
  map: L.Map, // instance de la carte
  event: LeafletMouseEvent 
}
