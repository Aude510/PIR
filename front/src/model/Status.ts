import {Owner} from "./Owner";
import {Drone} from "./Drone";
import {Zone} from "./Zone";

export type Status = {
  owner : Owner
  drones: Drone[]
  blocked_Zones:Zone[]
  time:number
}