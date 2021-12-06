import { ValueObject, Set, List } from "immutable";

export interface StateNode<T> extends ValueObject {

  getSuccessors(): Set<StateNode<T>>;

  evaluate(features: List<[(s: T) => number, number, number]>): number;

  toResult(): T;

  isTerminal(): boolean;

}

export class GraphSearch<T> {

  private readonly featureVectors: List<[(s: T) => number, number, number]>;

  constructor(featureVectors: List<[(s: T) => number, number, number]>) {
    this.featureVectors = featureVectors;
  }

  depthFirstSearch(root: StateNode<T>): StateNode<T> {
    let numStatesExplored = 0;
    const frontier: StateNode<T>[] = [root];
    let visited = Set<StateNode<T>>();
    let bestEvaluation = -Infinity;
    let bestNode = root;
    while (frontier.length > 0) {
      const node = frontier.pop()!;
      numStatesExplored++;
      visited = visited.add(node);
      // if (node.isTerminal()) {
      //   continue;
      // }
      const evaluation = node.evaluate(this.featureVectors)
      if (evaluation > bestEvaluation) {
        bestNode = node;
        bestEvaluation = evaluation;
      }
      node.getSuccessors()
        .filter(neighbor => !visited.includes(neighbor))
        .forEach(neighbor => {
          frontier.push(neighbor)
        });
    }
    console.log("Explored " + numStatesExplored + " states.");
    return bestNode;
  }

}