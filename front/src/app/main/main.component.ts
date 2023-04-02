import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MapMouseEvent } from 'src/model/MapMouseEvent';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {
  public currentTemplate: TemplateRef<any> | null;
  @ViewChild('addDrone', { static: true }) addDroneTemplate: TemplateRef<any> | null;
  @ViewChild('homePage', { static: true }) homePageTemplate: TemplateRef<any> | null;

  public eventCallback: (e: MapMouseEvent) => void;

  public constructor() {
    this.currentTemplate = null;
    this.addDroneTemplate = null;
    this.homePageTemplate = null;
    this.eventCallback = (e: MapMouseEvent) => {};
  }

  public ngOnInit(): void {
    this.currentTemplate = this.homePageTemplate;
  }

  public onAddDroneEvent(): void {
    this.currentTemplate = this.addDroneTemplate;
  }

  public onMapClickCallback(callback: (e: MapMouseEvent) => void): void {
    this.eventCallback = callback;
  }

  onMapClick(e: MapMouseEvent): void {
    this.eventCallback(e);
  }
}
