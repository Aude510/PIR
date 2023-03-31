import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseMapComponent } from './base-map/base-map.component';
import { MainComponent } from './main/main.component';
import { BlockZoneComponent } from './block-zone/block-zone.component';
import {AddDroneComponent} from "./add-drone/add-drone.component";
import {FormsModule} from "@angular/forms";
import {DroneInformationsComponent} from "./drone-informations/drone-informations.component";

@NgModule({
  declarations: [
    AppComponent,
    BaseMapComponent,
    MainComponent,
    BlockZoneComponent,
    AddDroneComponent,
    DroneInformationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
