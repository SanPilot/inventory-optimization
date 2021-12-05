import { List } from "immutable";
import { Agent } from "./Agent";
import { Order, Inventory, Assignment } from "../model";
import { ProblemState, State } from "./State";
import { StateNode } from "./Graph";
import { defaultFeatureVectors, FeatureVector } from "./features";
import { MaxPriorityQueue, PriorityQueueItem } from "datastructures-js";

export class LocalSearchAgent implements Agent {

  name: string;

  private readonly kBeams: number;

  constructor(kBeams: number) {
    this.kBeams = kBeams;
    this.name = `Local Search Agent (kBeams: ${kBeams})`;
  }

  assign(orders: List<Order>, inventory: Inventory, featureVectors: List<FeatureVector<ProblemState>> = defaultFeatureVectors): StateNode<ProblemState> {
    const state = new State({
      assignment: new Assignment(),
      orders,
      originalOrders: orders,
      inventory
    });

    let bestState: State = state;
    let bestEvaluation: number = state.evaluate(featureVectors);

    let frontier: MaxPriorityQueue<State> = new MaxPriorityQueue<State>();
    frontier.enqueue(state, bestEvaluation);

    while (frontier.size() > 0) {
      const current = frontier.dequeue() as PriorityQueueItem<State>;
      current.element.getSuccessors().forEach(s => {
        const evaluation = s.evaluate(featureVectors);
        if (evaluation > bestEvaluation) {
          bestEvaluation = evaluation;
          bestState = s;
        }
        frontier.enqueue(s, evaluation);
      })

      if (frontier.size() > this.kBeams) {
        frontier = (frontier.toArray() as PriorityQueueItem<State>[]).slice(0, this.kBeams).reduce((acc, cur) => acc.enqueue(cur.element, cur.priority), new MaxPriorityQueue<State>());
      }
    }

    return bestState;
  }

}
