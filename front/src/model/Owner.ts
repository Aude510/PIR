export type UUID = string;

export type IOwner = {
  ID: UUID;
}
export class Owner {

  constructor(public ID: UUID) {  }

  static fromServer(o: IOwner): Owner {
    return new Owner(o.ID);
  }

}
