import { List } from "immutable";
import { ProblemState, State } from "./State"

export type FeatureVector<T> = [(s: T) => number, number, number];

export const defaultFeatureVectors: List<FeatureVector<ProblemState>> = List([[costOfAssignment, -1, 0]]);

function costOfAssignment(state: ProblemState): number {
    return state.assignment.cost();
}