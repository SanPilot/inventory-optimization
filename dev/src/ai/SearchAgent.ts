import {List} from "immutable";
import {Agent} from "./Agent";
import {Order, Inventory, Assignment} from "../model";
import {ProblemState, State} from "./State";
import { GraphSearch } from "./Graph";
import { defaultFeatureVectors, FeatureVector } from "./features";

export class SearchAgent implements Agent {

  assign(orders: List<Order>, inventory: Inventory, featureVectors: List<FeatureVector<ProblemState>> = defaultFeatureVectors): Assignment {
    const state = new State({
      assignment: new Assignment(),
      orders,
      inventory
    });
    return new GraphSearch(featureVectors).depthFirstSearch(state).toResult().assignment;
  }

}
