import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.sass']
})
export class TestComponent implements OnInit {

  public value: number = 0;
  public pokemon: string | undefined;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  clicked() {
    console.log('clicked');
    this.value++;
    this.http.get('https://pokeapi.co/api/v2/pokemon/ditto').toPromise().then((result: any)=> {
      console.log(result);
      this.pokemon = JSON.stringify(result);
    })
  }

}
