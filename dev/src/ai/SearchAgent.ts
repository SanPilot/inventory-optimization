import {Agent} from "./Agent";
import {Order, Inventory, Assignment} from "../model";

export class SearchAgent implements Agent {

  assign(order: Order[], inventory: Inventory): Assignment {
    const assignment = new Assignment();
    // TODO: implement search
    return assignment;
  }

}
