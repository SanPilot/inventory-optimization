import { List } from "immutable";
import { ProblemState, State } from "./State"

export type FeatureVector<T> = [(s: T) => number, number, number];

export const costOfAssignment = (state: ProblemState): number => state.assignment.calculateCost();

export const valueOfInventory = (state: ProblemState): number => state.inventory.totalValue();

export const customerSatisfaction = (state: ProblemState): number => state.assignment.calculateSatisfaction();

export const unfilledOrders = (state: ProblemState): number => state.orders.count(o => o.size > 0) / state.originalOrders.size;

export const defaultFeatureVectors: List<FeatureVector<ProblemState>> = List([
//    [costOfAssignment, -1, 0],
//    [valueOfInventory, -1.1, 0],
    [customerSatisfaction, 1, 0]
//    [unfilledOrders, -1.1, 0]
]);

export const satisfactionOnly: List<FeatureVector<ProblemState>> = List([
  [customerSatisfaction, 1, 0]
]);