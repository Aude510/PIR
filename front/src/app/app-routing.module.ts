import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockZoneComponent } from './block-zone/block-zone.component';
import { MainComponent } from './main/main.component';
import {AddDroneComponent} from "./add-drone/add-drone.component";

const routes: Routes = [
  { path:'add-drone', component: AddDroneComponent },
  {path: "**",component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
