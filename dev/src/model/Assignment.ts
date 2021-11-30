/**
 * A map of customers to products.
 * Can be evaluated for the score of the assignment.
 */

import { Product } from './Product';
import { Customer } from './Customer';
import _ from "lodash";
import { Order } from './Order';

export class Assignment {
  private _assignment: Map<Customer, Product[]>;

  constructor(assignment: Map<Customer, Product[]> = new Map()) {
    this._assignment = assignment;
  }

  copy() {
    return new Assignment(new Map(this._assignment));
  }

  productsGivenTo(customer: Customer): Product[] {
    return this._assignment.get(customer) ?? [];
  }

  assignProductToCustomer(customer: Customer, product: Product) {
    const products = this.productsGivenTo(customer);
    this._assignment.set(customer, [...products, product]);
    return this;
  }

  fulfillsOrders(orders: Order[]): boolean {
    return orders.every(([customer, size]) => this.productsGivenTo(customer).length === size);
  }

  cost(): number {
    return _.sum(
      Array.from(this._assignment.keys())
        .map(customer => this.costOfCustomer(customer))
    )
  }

  costOfCustomer(customer: Customer) {
    return _.sum(
      this.productsGivenTo(customer).map(product => product.cost)
    );
  }

}
