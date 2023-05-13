import { Component, Input, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import {MapService} from "../services/map.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  public sideBarWidth: string;

  public onMousePress: (e: MouseEvent) => void;
  private onMouseRelease: (e: MouseEvent) => void;
  private onMouseMove: (e: MouseEvent) => void;

  @Input() template: TemplateRef<any> | null;

  public constructor(private location: Location, private mapService: MapService) {
    this.sideBarWidth = "250px";

    this.template = null;

    this.onMouseMove = (e: MouseEvent): void => {};
    this.onMousePress = (e: MouseEvent): void => {};
    this.onMouseRelease = (e: MouseEvent): void => {};
  }

  public ngOnInit(): void {
    this.onMouseMove = (e: MouseEvent): void => {
      this.sideBarWidth = `${e.x + 2.5}px`;
    }

    this.onMouseRelease = (e: MouseEvent): void => {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseRelease);
    }

    this.onMousePress = (e: MouseEvent): void => {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseRelease);
    }
  }

  onBack(): void {
      this.location.back();
      this.mapService.clearMap();
  }
}
