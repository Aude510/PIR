import {IOwner, Owner} from "./Owner";
import {IPath, Path} from "./Path";
import {IPoint, Point} from "./Point";
import {MapToDiscretCoordService} from "../app/services/map-to-discret-coord.service";

export type IDrone = {
  id: number,
  name: string,
  owner: IOwner,
  priority: number,
  path: IPoint[],
  start: IPoint,
  destination: IPoint
}
export class Drone {

  public id: number | undefined;

  constructor(public name: string,
              public owner: Owner,
              public priority: number,
              public path: Path,
              public start: Point,
              public destination: Point) {
  }

  static fromServer(drone: IDrone) {
    console.log(`Parsed path ${JSON.stringify(drone.path)}`);
    return new Drone(
      drone.name,
      Owner.fromServer(drone.owner),
      drone.priority,
      Path.fromServer(drone.path),
      Point.fromTuple(drone.start.x, drone.start.y),
      Point.fromTuple(drone.destination.x, drone.destination.y)
    );
  }
}

