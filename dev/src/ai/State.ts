import { Record, List } from "immutable";
import { Assignment, Inventory, Order } from "../model";
import { StateNode } from "./Graph";
import _ from "lodash";

export class State extends Record({
  assignment: new Assignment(),
  orders: List<Order>(),
  inventory: new Inventory()
}) implements StateNode<Assignment> {

  getSuccessors(): List<State> {
    if (this.orders.size === 0) {
      return List();
    }
    const order = this.orders.get(0)!;
    if (order.size === 0) {
      return new State({
        assignment: this.assignment,
        orders: this.orders.skip(1),
        inventory: this.inventory
      }).getSuccessors();
    }
    return this.inventory.products()
      .filter(product => !order.customer.isAllergicTo(product) &&
                         !this.assignment.hasProductAssignedToCustomer(order.customer, product))
      .map(product => new State({
        assignment: this.assignment.assignProductToCustomer(order.customer, product),
        orders: List([new Order({customer: order.customer, size: order.size - 1})]).concat(this.orders.skip(1)),
        inventory: this.inventory.removeProduct(product, 1)
      }));
  }

  isTerminal(): boolean {
    return this.orders.every(order => order.size === 0);
  }

  evaluate(): number {
    // TODO: incorporate customer preferences
    return -this.assignment.cost();
  }

  toResult(): Assignment {
    return this.assignment;
  }

}