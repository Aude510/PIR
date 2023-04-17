import {Owner} from "./Owner";
import {Path} from "./Path";
import {Point} from "./Point";

export class Drone {


  constructor(public name: string,
              public owner: Owner,
              public priority: number,
              public path: Path,
              public start: Point,
              public destination: Point) { }

}
