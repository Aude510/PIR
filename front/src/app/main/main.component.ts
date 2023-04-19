import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MapMouseEvent } from 'src/model/MapMouseEvent';
import {OwnerServiceService} from "../services/owner-service.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {
  public currentTemplate: TemplateRef<any> | null;
  public previousTemplate: TemplateRef<any> | null;
  public displayType: string;

  public something: any = "someData";

  @ViewChild('addDrone', { static: true }) addDroneTemplate: TemplateRef<any> | null;
  @ViewChild('blockZone', { static: true }) blockZoneTemplate: TemplateRef<any> | null;
  @ViewChild('homePage', { static: true }) homePageTemplate: TemplateRef<any> | null;

  public eventCallback: (e: MapMouseEvent) => void;

  public constructor() {
    this.displayType = 'none';
    this.currentTemplate = null;
    this.previousTemplate = null;
    this.addDroneTemplate = null;
    this.homePageTemplate = null;
    this.blockZoneTemplate = null;
    this.eventCallback = (e: MapMouseEvent) => {};
  }

  public ngOnInit(): void {
    this.currentTemplate = this.homePageTemplate;
  }

  public onAddDroneEvent(): void {
    this.previousTemplate = this.currentTemplate;
    this.currentTemplate = this.addDroneTemplate;
    this.displayType = 'flex';
  }

  public onBlockZoneEvent(): void {
    this.previousTemplate = this.currentTemplate;
    this.currentTemplate = this.blockZoneTemplate;
    this.displayType = 'flex';
  }

  public onMapClickCallback(callback: (e: MapMouseEvent) => void): void {
    this.eventCallback = callback;
  }

  public onMapClick(e: MapMouseEvent): void {
    this.eventCallback(e);
    this.something = e;
  }

  public onPreviousPageEvent(): void {
    this.currentTemplate = this.previousTemplate;
    this.eventCallback = (e: MapMouseEvent) => {};
    this.displayType = 'none';
  }
}
