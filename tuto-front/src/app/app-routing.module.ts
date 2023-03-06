import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestComponent} from "./test/test.component";
import {Test2Component} from "./test2/test2.component";
import {AddDroneComponent} from "./add-drone/add-drone.component";

const routes: Routes = [
  { path:'test', component: TestComponent },
  { path:'add-drone', component: AddDroneComponent },
  { path: '**', component: Test2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
