import {ValueObject, Set} from "immutable";

export interface StateNode<T> extends ValueObject {

  getSuccessors(): Set<StateNode<T>>;

  evaluate(): number;

  toResult(): T;

  isTerminal(): boolean;

}

export class TreeSearch {

  depthFirstSearch<T>(root: StateNode<T>): StateNode<T> {
    const frontier: StateNode<T>[] = [root];
    let visited = Set<StateNode<T>>();
    let bestEvaluation = -Infinity;
    let bestNode = root;
    while (frontier.length > 0) {
      const node = frontier.pop()!;
      visited = visited.add(node);
      if (node.isTerminal()) {
        continue;
      }
      if (node.evaluate() > bestEvaluation) {
        bestNode = node;
      }
      node.getSuccessors()
          .filter(neighbor => !visited.includes(neighbor))
          .forEach(neighbor => {
            frontier.push(neighbor)
          });
    }
    return bestNode;
  }

}