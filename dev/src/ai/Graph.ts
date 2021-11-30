export interface StateNode<T> {

  getSuccessors(): StateNode<T>[];

  evaluate(): number;

  toResult(): T;

  isTerminal(): boolean;

}

export class TreeSearch {

  depthFirstSearch<T>(root: StateNode<T>): StateNode<T> {
    const frontier: StateNode<T>[] = [root];
    let bestEvaluation = -Infinity;
    let bestNode = root;
    while (frontier.length > 0) {
      const node = frontier.pop()!;
      if (node.isTerminal()) {
        continue;
      }
      if (node.evaluate() > bestEvaluation) {
        bestNode = node;
      }
      node.getSuccessors()
          .forEach(neighbor => {
            frontier.push(neighbor)
          });
    }
    return bestNode;
  }

}