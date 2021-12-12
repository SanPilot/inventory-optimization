import { Record, List, Set, RecordOf } from "immutable";
import { Assignment, Customer, Inventory, Order, orders, Product } from "../model";
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
    return this.orders
      .filter(order => order.size > 0)
      .reduce((states, order) => states.concat(
        this.assignableProducts(order.customer)
          .map(product => this.assignProductToOrder(product, order))
        ),
        Set()
      );
  }

  private assignableProducts(customer: Customer): Set<Product> {
    return this.inventory.products()
      .filter(product =>
        !customer.isAllergicTo(product) &&
        !this.assignment.hasProductAssignedToCustomer(customer, product)
      );
  }

  private assignProductToOrder(product: Product, order: Order): State {
    return new State({
      assignment: this.assignment.assignProductToCustomer(order.customer, product),
      orders: this.replaceOrder(
        order,
        new Order({customer: order.customer, size: order.size - 1})
      ),
      originalOrders: this.originalOrders,
      inventory: this.inventory.removeProduct(product, 1)
    });
  }

  private replaceOrder(original: Order, replacement: Order): List<Order> {
    return this.orders.update(
      this.orders.findIndex(order => order.equals(original)),
      original,
      () => replacement
    );
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