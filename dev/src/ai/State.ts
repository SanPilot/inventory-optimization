import { Record, List, Set, RecordOf } from "immutable";
import { Assignment, Inventory, Order } from "../model";
import { StateNode } from "./Graph";
import _ from "lodash";

export type ProblemState = RecordOf<{ assignment: Assignment, orders: List<Order>, originalOrders: List<Order>, inventory: Inventory }>;

export class State extends Record({
  assignment: new Assignment(),
  originalOrders: List<Order>(),
  orders: List<Order>(),
  inventory: new Inventory()
}) implements StateNode<ProblemState> {

  getSuccessors(): Set<State> {
    if (this.orders.size === 0) {
      return Set();
    }
    const order = this.orders.get(0)!;
    return this.inventory.products()
      .filter(product => !order.customer.isAllergicTo(product) &&
        !this.assignment.hasProductAssignedToCustomer(order.customer, product))
      .map(product => new State({
        assignment: this.assignment.assignProductToCustomer(order.customer, product),
        orders: order.size > 1 ?
          List([new Order({ customer: order.customer, size: order.size - 1 })]).concat(this.orders.skip(1)) :
          this.orders.skip(1),
        originalOrders: this.originalOrders,
        inventory: this.inventory.removeProduct(product, 1)
      }));
  }

  isTerminal(): boolean {
    return this.orders.every(order => order.size === 0);
  }

  evaluate(features: List<[(s: ProblemState) => number, number, number]>): number {
    return features.reduce((acc, feature) => {
      return acc + (feature[1] != 0 ? (feature[0](this) * feature[1] + feature[2]) : 0);
    }, 0);
  }

  toResult(): ProblemState {
    return this;
  }

}