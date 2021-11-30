import {Agent} from "./Agent";
import {Order, Inventory, Assignment} from "../model";
import {State} from "./State";
import { TreeSearch } from "./Graph";

export class SearchAgent implements Agent {

  assign(orders: Order[], inventory: Inventory): Assignment {
    const state = new State(new Assignment(), orders, inventory);
    return new TreeSearch().depthFirstSearch(state).toResult();
  }

}
