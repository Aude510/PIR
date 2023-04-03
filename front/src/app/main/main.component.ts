import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MapMouseEvent } from 'src/model/MapMouseEvent';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {
  public currentTemplate: TemplateRef<any> | null;
  public previousTemplate: TemplateRef<any> | null;
  public displayType: string;

  @ViewChild('addDrone', { static: true }) addDroneTemplate: TemplateRef<any> | null;
  @ViewChild('homePage', { static: true }) homePageTemplate: TemplateRef<any> | null;

  public eventCallback: (e: MapMouseEvent) => void;

  public constructor() {
    this.displayType = 'none';
    this.currentTemplate = null;
    this.previousTemplate = null;
    this.addDroneTemplate = null;
    this.homePageTemplate = null;
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

  public onMapClickCallback(callback: (e: MapMouseEvent) => void): void {
    this.eventCallback = callback;
  }

  public onMapClick(e: MapMouseEvent): void {
    this.eventCallback(e);
  }

  public onPreviousPageEvent(): void {
    this.currentTemplate = this.previousTemplate;
    this.displayType = 'none';
  }
}
