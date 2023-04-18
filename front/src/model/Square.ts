import {Point} from "./Point";

export class Square {
  constructor(public points:Point[]){
    if(points.length >4){
      throw new Error("Too much points were provided");
    }
  }
}
