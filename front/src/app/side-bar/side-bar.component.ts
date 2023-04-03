import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

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
  
  @Input() displayType: string;
  @Input() template: TemplateRef<any> | null;
  
  @Output() previousPageEvent: EventEmitter<void>;

  public constructor() {
    this.previousPageEvent = new EventEmitter<void>();
    this.displayType = 'flex';
    this.sideBarWidth = "250px";
    this.template = null;

    this.onMouseMove = (e: MouseEvent): void => {};
    this.onMousePress = (e: MouseEvent): void => {};
    this.onMouseRelease = (e: MouseEvent): void => {};
  }

  public ngAfterViewInit(): void {    
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

  public onBack(): void {
    this.previousPageEvent.emit();
  }
}
