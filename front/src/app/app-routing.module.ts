import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockZoneComponent } from './block-zone/block-zone.component';

const routes: Routes = [{path: "**",component: BlockZoneComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
