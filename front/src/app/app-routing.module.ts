import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockZoneComponent } from './block-zone/block-zone.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [{path: "aude",component: BlockZoneComponent},{path: "**",component: MainComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
