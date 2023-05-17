import {
  Component,
  EventEmitter,
  Injector,
  Output,
  ViewContainerRef
} from '@angular/core';
import {Router} from "@angular/router";
import {MapService} from "../services/map.service";
import {WebSocketService} from "../services/web-socket.service";
import {LayerGroup} from "leaflet";
import * as L from "leaflet";
import {MapToDiscretCoordService} from "../services/map-to-discret-coord.service";
import {DroneInformationsComponent} from "../drone-informations/drone-informations.component";
import {StatusService} from "../services/status.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent {
  @Output() addDroneEvent: EventEmitter<void>;
  @Output() blockZoneEvent: EventEmitter<void>;

  private layer: LayerGroup = new L.LayerGroup();
  private component : any;

  public constructor(private router: Router,
                     private mapService: MapService,
                     private webSocket: WebSocketService,
                     private coords: MapToDiscretCoordService,
                     public status: StatusService,
                     private injector: Injector,
                     private viewContainerRef: ViewContainerRef) {

    this.addDroneEvent = new EventEmitter<void>();
    this.blockZoneEvent = new EventEmitter<void>();
    this.mapService.onMapClickedTakeSubscription();
    this.mapService.addToMap(this.layer);


    this.mapService.map?.on('click',(e) => {

      // @ts-ignore
      const classes: string[] = [...e.originalEvent.originalTarget.classList];
      const classContainsMarker = classes.reduce((prev, current) => {
        return prev || (current === "leaflet-marker-icon");
      }, false)
      if (!classContainsMarker) {
        console.log("not marker clicked");
          return;
      }
      console.log("event:")
      // @ts-ignore
      console.log(e.originalEvent.originalTarget.classList);
      // @ts-ignore
      const droneName = e.originalEvent.originalTarget.title;
      const drone = this.status.getDroneList()
        .filter((d) => d.name === droneName)[0];
      this.component = this.viewContainerRef.createComponent(DroneInformationsComponent);
      this.component.setInput('drone', drone);
      // Promise.all(this.status.getDroneList()
      //   .filter((d) => d.name === droneName)
      //   .map((d) => this.webSocket.sendDeleteDrone(d)))
      //   .then((d) => {
      //     console.log("Drones deleted " + d)
      // }).catch((e) => {
      //   console.error("Error deleting drone: " + e);
      // });
      // @ts-ignore
      //const drone = ((this.status.getDroneList().filter((d) => d.path.getPath().at(0).toLatLng().distanceTo(e.latlng) < 10)).at(0));
      //if(drone){
      const popup = L.popup()
          // @ts-ignore
          .setLatLng(/*drone.path.getPath().at(0).toLatLng()*/ e.latlng)
          .setContent(this.component.location.nativeElement) // Not fully functional TODO : Add the drone to the drone-information-component
          // @ts-ignore
          .openOn(this.mapService.map);
      //}
    })


    this.webSocket.subToMapUpdate().subscribe((status) => {
      console.log("mmmmmmmmmmmmmmmmmmmmmm")
      console.log(status.drones)
      this.layer.remove();
      this.layer = new L.LayerGroup();
      this.mapService.addToMap(this.layer);
      status.drones.forEach((drone) => {
        console.log("Drone: " + drone.name);
        this.coords.addDroneToMap(drone, this.layer);
      })
      status.blocked_Zones.forEach((z) => {
        // @ts-ignore
        this.coords.addZoneToMap(z.points, this.layer);
      })
    })
  }

  public onAddDrone(e: MouseEvent): void {
    this.router.navigateByUrl("/add-drone");
  }

  public onBlockZone(e: MouseEvent): void {
    this.blockZoneEvent.emit();
    this.router.navigateByUrl("/block-zone");
    console.log("go to block zone");
  }
}
