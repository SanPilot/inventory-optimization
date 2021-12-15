import { List, Set } from "immutable";
import { Agent } from "./Agent";
import { Order, Inventory, Assignment } from "../model";
import { ProblemState, State } from "./State";
import { StateNode } from "./Graph";
import { defaultFeatureVectors, FeatureVector } from "./features";
import { MaxPriorityQueue, PriorityQueueItem } from "datastructures-js";

// Default heat function - always returns 0.5
export const defaultHeatFunction = (totalStates: number, statesSinceImprovement: number): number => 0.5

// Heat function slowly reduces the heat over time
export const slowReduceHeatFunction = (totalStates: number, statesSinceImprovement: number): number => Math.max(0.1, 0.6 - totalStates / 10000)

// Heat function that increases heat when no improvement has been made
export const increaseHeatFunction = (totalStates: number, statesSinceImprovement: number): number => Math.min(0.6, statesSinceImprovement / 100)

export class LocalSearchAgent implements Agent {

  name: string;

  private readonly kBeams: number;
  private readonly maxExploredStates: number;
  private readonly heatFunction: (totalStates: number, statesSinceImprovement: number) => number;

  constructor(kBeams: number, maxExploredStates=100_000, heatFunction: (totalStates: number, statesSinceImprovement: number) => number = defaultHeatFunction) {
    this.kBeams = kBeams;
    this.heatFunction = heatFunction;
    this.name = `Local Search Agent (kBeams: ${kBeams}, heatFunction: ${heatFunction.name})`;
    this.maxExploredStates = maxExploredStates;
  }

  assign(orders: List<Order>, inventory: Inventory, featureVectors: List<FeatureVector<ProblemState>> = defaultFeatureVectors): StateNode<ProblemState> {
    let numStatesExplored = 0;
    const state = new State({
      assignment: new Assignment(),
      orders,
      originalOrders: orders,
      inventory
    });

    let bestState: State = state;
    let bestEvaluation: number = state.evaluate(featureVectors);
    let statesSinceImprovement = 0;

    let frontier: MaxPriorityQueue<State> = new MaxPriorityQueue<State>();
    frontier.enqueue(state, bestEvaluation);

    let visited = Set<StateNode<ProblemState>>();

    while (frontier.size() > 0) {
      if (numStatesExplored > this.maxExploredStates) {
        throw new Error("Exceeded maximum number of explored states");
      }
      const current = frontier.dequeue() as PriorityQueueItem<State>;
      visited = visited.add(current.element);
      numStatesExplored++;
      statesSinceImprovement++;
      current.element.getSuccessors()
        .filter(neighbor => !visited.includes(neighbor))
        .forEach(s => {
          const evaluation = s.evaluate(featureVectors);
          if (evaluation > bestEvaluation) {
            bestEvaluation = evaluation;
            bestState = s;
            statesSinceImprovement = 0;
          }
          frontier.enqueue(s, evaluation * (this.heatFunction(numStatesExplored, statesSinceImprovement) * (1 + Math.random() * 2)));
        })

      if (frontier.size() > this.kBeams) {
        frontier = (frontier.toArray() as PriorityQueueItem<State>[]).slice(0, this.kBeams).reduce((acc, cur) => acc.enqueue(cur.element, cur.priority), new MaxPriorityQueue<State>());
      }
    }
    // console.log("Explored " + numStatesExplored + " states.");
    return bestState;
  }

}
