import { List } from "immutable";
import { Order, Inventory, Assignment } from "../model";
import { FeatureVector } from "./features";
import { StateNode } from "./Graph";
import { ProblemState, State } from "./State";

export interface Agent {

  assign(orders: List<Order>, inventory: Inventory, featureVectors?: List<FeatureVector<State>>): StateNode<ProblemState>;

  name: string;
}
