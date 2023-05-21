import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {Owner} from "../../model/Owner";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private readonly key = "ownerID";
  public id: string;
  constructor() {
    const id = window.localStorage.getItem(this.key);
    if (!id) {
      const uuid = uuidv4();
      window.localStorage.setItem(this.key, uuid);
      this.id = uuid;
    } else {
      this.id = id;
    }
  }

  getOwner() {
    return new Owner(this.id);
  }
}
