import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockZoneComponent } from './block-zone/block-zone.component';
import {AddDroneComponent} from "./add-drone/add-drone.component";
import {HomePageComponent} from "./home-page/home-page.component";

const routes: Routes = [
  { path:'add-drone', component: AddDroneComponent },
  { path:'block-zone', component: BlockZoneComponent},
  { path: "**",component: HomePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
