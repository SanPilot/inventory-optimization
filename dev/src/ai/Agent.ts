import {Order, Inventory, Assignment} from "../model";

export interface Agent {

  assign(orders: Order[], inventory: Inventory): Assignment;

}
