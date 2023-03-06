import { Component } from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-add-drone',
  templateUrl: './add-drone.component.html',
  styleUrls: ['./add-drone.component.sass']
})
export class AddDroneComponent {
  onSubmit(f: NgForm) {
    console.log(f);
    console.log(JSON.stringify(f.value));
  }
}
