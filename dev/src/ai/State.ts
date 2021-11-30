import { Assignment, Inventory, Order } from "../model";
import { StateNode } from "./Graph";
import _ from "lodash";

export class State implements StateNode<Assignment> {

  private readonly assignment: Assignment;
  private readonly orders: Order[];
  private readonly inventory: Inventory;

  constructor(assignment: Assignment, orders: Order[], inventory: Inventory) {
    this.assignment = assignment;
    this.orders = orders;
    this.inventory = inventory;
  }

  getSuccessors(): State[] {
    if (this.orders.length === 0) {
      return [];
    }
    const [customer, size] = this.orders[0];
    if (size === 0) {
      return new State(this.assignment, this.orders.slice(1), this.inventory).getSuccessors();
    }
    return this.inventory.products()
      .filter(product => !customer.isAllergicTo(product) && !this.assignment.hasProductAssignedToCustomer(customer, product))
      .map(product => new State(
        this.assignment.copy().assignProductToCustomer(customer, product),
        [[customer, size - 1], ...this.orders.slice(1)],
        this.inventory.copy().removeProduct(product, 1)
      ));
  }

  isTerminal(): boolean {
    return this.orders.every(([_, size]) => size === 0);
  }

  evaluate(): number {
    // TODO: incorporate customer preferences
    return -this.assignment.cost();
  }

  toResult(): Assignment {
    return this.assignment.copy();
  }

}