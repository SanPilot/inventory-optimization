import { List } from "immutable";
import { ProblemState, State } from "./State"

export type FeatureVector<T> = [(s: T) => number, number, number];

export const defaultFeatureVectors: List<FeatureVector<ProblemState>> = List([
    [costOfAssignment, -1, 0],
    [valueOfInventory, -1.1, 0],
    [customerSatisfaction, 1, 0]
]);

function costOfAssignment(state: ProblemState): number {
    return state.assignment.calculateCost();
}

function valueOfInventory(state: ProblemState): number {
    return state.inventory.value();
}

function customerSatisfaction(state: ProblemState): number {
    return state.assignment.calculateSatisfaction();
}