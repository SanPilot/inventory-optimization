import { List } from "immutable";
import { Agent } from "./Agent";
import { Order, Inventory, Assignment } from "../model";
import { ProblemState, State } from "./State";
import { GraphSearch, StateNode } from "./Graph";
import { defaultFeatureVectors, FeatureVector } from "./features";

export class SearchAgent implements Agent {

  name: string = "Graph Search Agent";

  assign(orders: List<Order>, inventory: Inventory, featureVectors: List<FeatureVector<ProblemState>> = defaultFeatureVectors): StateNode<ProblemState> {
    const state = new State({
      assignment: new Assignment(),
      orders,
      originalOrders: orders,
      inventory,
      originalInventory: inventory
    });
    return new GraphSearch(featureVectors).depthFirstSearch(state);
  }

}
