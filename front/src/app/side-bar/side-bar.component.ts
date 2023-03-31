import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
})
export class SideBarComponent {
  public sideBarWidth: string;
  private resizeElement: HTMLDivElement | null;
  private sideBar: HTMLDivElement | null

  public onMousePress: (e: MouseEvent) => void;
  public onMouseRelease: (e: MouseEvent) => void;
  private onMouseMove: (e: MouseEvent) => void;


  public constructor() {
    this.sideBarWidth = "250px";
    this.resizeElement = null;
    this.sideBar = null;

    this.onMouseMove = (e: MouseEvent): void => {};
    this.onMousePress = (e: MouseEvent): void => {};
    this.onMouseRelease = (e: MouseEvent): void => {};
  }

  public ngOnInit(): void {
    this.resizeElement = <HTMLDivElement>document.getElementById('resize');
    this.sideBar = <HTMLDivElement>document.getElementById('side-bar-root"');
  
    this.onMouseMove = (e: MouseEvent): void => {
      this.sideBarWidth = `${e.x + 2.5}px`;
    }

    this.onMousePress = (e: MouseEvent): void => {
      document.addEventListener('mousemove', this.onMouseMove);
    }

    this.onMouseRelease = (e: MouseEvent): void => {
      document.removeEventListener('mousemove', this.onMouseMove);
    }
  }
}
