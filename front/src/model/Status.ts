import {IOwner, Owner} from "./Owner";
import {Drone, IDrone} from "./Drone";
import {Zone} from "./Zone";

export type IStatus = {
  owner: IOwner,
  drones: IDrone[],
  blocked_Zones: Zone[],
  time: number,
  changed: string[]
}
export class Status {
  constructor(public owner : Owner,
  public drones: Drone[],
  public blocked_Zones:Zone[],
  public time: number,
  public changed: string[] // names of all drone who've changed path
) {};

  public static formServer(s: IStatus) {
    return new Status(
      Owner.fromServer(s.owner),
      s.drones.map(Drone.fromServer),
      s.blocked_Zones,
      s.time,
      s.changed
    )
  }
}
