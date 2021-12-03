import {List} from "immutable";
import {Order, Inventory, Assignment} from "../model";

export interface Agent {

  assign(orders: List<Order>, inventory: Inventory): Assignment;

}
