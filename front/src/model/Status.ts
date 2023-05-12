import {Owner} from "./Owner";
import {Drone} from "./Drone";
import {Zone} from "./Zone";

export class Status {
  constructor(public owner : Owner,
  public drones: Drone[],
  public blocked_Zones:Zone[],
  public time: number,
  public changed: string[] // names of all drone who've changed path
) {};

  public static formServer(statusJSON: any) {
    // TODO
  }
}
